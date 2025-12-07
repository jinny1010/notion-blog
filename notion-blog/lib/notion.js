import { Client } from '@notionhq/client'

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// 데이터베이스에서 모든 항목 가져오기
export async function getDatabase() {
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!databaseId) {
    console.error('NOTION_DATABASE_ID가 설정되지 않았습니다.')
    return []
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    })

    return response.results.map((page) => {
      const properties = page.properties

      // Name 속성 추출 (title 타입)
      let name = ''
      if (properties.Name?.title?.[0]?.plain_text) {
        name = properties.Name.title[0].plain_text
      }

      // Description 속성 추출 (rich_text 타입)
      let description = ''
      if (properties.Description?.rich_text?.[0]?.plain_text) {
        description = properties.Description.rich_text[0].plain_text
      }

      // Image 속성 추출 (files 타입)
      let image = null
      if (properties.Image?.files?.[0]) {
        const file = properties.Image.files[0]
        if (file.type === 'file') {
          image = file.file.url
        } else if (file.type === 'external') {
          image = file.external.url
        }
      }

      return {
        id: page.id,
        name,
        description,
        image,
        createdTime: page.created_time,
      }
    })
  } catch (error) {
    console.error('Notion API 오류:', error)
    return []
  }
}
