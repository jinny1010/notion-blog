import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// 텍스트 속성 추출 헬퍼
function getText(property) {
  if (!property) return ''
  if (property.title?.[0]?.plain_text) return property.title[0].plain_text
  if (property.rich_text?.[0]?.plain_text) return property.rich_text[0].plain_text
  return ''
}

// 파일 URL 추출 헬퍼
function getFile(property) {
  if (!property?.files?.[0]) return null
  const file = property.files[0]
  if (file.type === 'file') return file.file.url
  if (file.type === 'external') return file.external.url
  return null
}

// Profile DB
export async function getProfile() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_PROFILE_DB,
    })
    if (response.results.length === 0) return null
    const page = response.results[0]
    const p = page.properties
    return {
      name: getText(p.Name),
      username: getText(p.Username),
      location: getText(p.Location),
      profileImage: getFile(p.ProfileImage),
    }
  } catch (error) {
    console.error('Profile DB error:', error)
    return null
  }
}

// Music DB
export async function getMusic() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_MUSIC_DB,
    })
    return response.results.map((page) => {
      const p = page.properties
      return {
        id: page.id,
        name: getText(p.Name),
        artist: getText(p.Artist),
        albumCover: getFile(p.AlbumCover),
      }
    })
  } catch (error) {
    console.error('Music DB error:', error)
    return []
  }
}

// Gallery DB
export async function getGallery() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_GALLERY_DB,
      sorts: [{ property: 'Order', direction: 'ascending' }],
    })
    return response.results.map((page) => {
      const p = page.properties
      return {
        id: page.id,
        name: getText(p.Name),
        image: getFile(p.Image),
        order: p.Order?.number || 0,
      }
    })
  } catch (error) {
    console.error('Gallery DB error:', error)
    return []
  }
}

// Messages DB
export async function getMessages() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_MESSAGES_DB,
    })
    return response.results.map((page) => {
      const p = page.properties
      return {
        id: page.id,
        name: getText(p.Name),
        message: getText(p.Message),
      }
    })
  } catch (error) {
    console.error('Messages DB error:', error)
    return []
  }
}

// Diary DB
export async function getDiary() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DIARY_DB,
      sorts: [{ property: 'Date', direction: 'descending' }],
    })
    return response.results.map((page) => {
      const p = page.properties
      return {
        id: page.id,
        name: getText(p.Name),
        content: getText(p.Content),
        date: p.Date?.date?.start || '',
      }
    })
  } catch (error) {
    console.error('Diary DB error:', error)
    return []
  }
}
