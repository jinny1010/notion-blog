import { getDatabase } from '../lib/notion'

// 페이지 새로고침 간격 (초) - 60초마다 새로운 데이터 확인
export const revalidate = 60

export default async function Home() {
  const items = await getDatabase()

  return (
    <main className="container">
      <header className="header">
        <h1>✨ My Notion Blog</h1>
        <p>노션 데이터베이스와 연동된 개인 블로그</p>
      </header>

      {items.length === 0 ? (
        <div className="empty">
          <p>📭 아직 데이터가 없습니다.</p>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            노션 데이터베이스에 항목을 추가해보세요!
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <article key={item.id} className="card">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-image"
                />
              )}
              <h2>{item.name || '제목 없음'}</h2>
              <p>{item.description || '설명이 없습니다.'}</p>
            </article>
          ))}
        </div>
      )}

      <footer style={{ textAlign: 'center', marginTop: '60px', color: '#9d174d', fontSize: '0.9rem' }}>
        <p>Powered by Notion API + Next.js + Vercel</p>
      </footer>
    </main>
  )
}
