import { getProfile, getMusic, getGallery, getMessages, getDiary } from '../lib/notion'

export const revalidate = 60

export default async function Home() {
  const [profile, music, gallery, messages, diary] = await Promise.all([
    getProfile(),
    getMusic(),
    getGallery(),
    getMessages(),
    getDiary(),
  ])

  const currentMusic = music[0]
  const currentMessage = messages[0]
  const latestDiary = diary[0]
  const featuredImage = gallery[0]

  return (
    <main>
      <div className="container">
        {/* 왼쪽 카드 */}
        <div className="left-card">
          {/* 프로필 */}
          <div className="profile-section">
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt="Profile" className="profile-image" />
            ) : (
              <div className="profile-image" style={{ background: 'rgba(255,255,255,0.2)' }} />
            )}
            <div className="profile-name">{profile?.name || 'Your Name'}</div>
            <div className="profile-username">@{profile?.username || 'username'}</div>
            {profile?.location && (
              <div className="profile-location">
                📍 {profile.location}
              </div>
            )}
            <div className="profile-buttons">
              <button className="profile-btn">seguir</button>
              <button className="profile-btn">mensaje</button>
            </div>
          </div>

          {/* 음악 */}
          {currentMusic && (
            <div className="music-section">
              {currentMusic.albumCover ? (
                <img src={currentMusic.albumCover} alt="Album" className="music-cover" />
              ) : (
                <div className="music-cover" style={{ background: 'rgba(255,255,255,0.2)' }} />
              )}
              <div className="music-info">
                <div className="music-title">{currentMusic.name}</div>
                <div className="music-artist">{currentMusic.artist}</div>
              </div>
              <div className="music-play">▶</div>
            </div>
          )}

          {/* 메시지 */}
          {currentMessage && (
            <div className="message-section">
              <div className="message-text">"{currentMessage.message}"</div>
              <div className="message-label">description ❤️</div>
            </div>
          )}

          {/* 갤러리 */}
          {gallery.length > 0 && (
            <div className="gallery-section">
              <div className="gallery-title">GALLERY</div>
              <div className="gallery-grid">
                {gallery.slice(0, 4).map((item, index) => (
                  <div key={item.id} style={{ position: 'relative' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="gallery-item" />
                    ) : (
                      <div className="gallery-item" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    )}
                    <span className="gallery-number">0{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 영역 */}
        <div className="right-section">
          {/* 큰 이미지 */}
          {featuredImage?.image ? (
            <img src={featuredImage.image} alt="Featured" className="feature-image" />
          ) : (
            <div className="feature-image" style={{ background: '#ccc' }} />
          )}

          {/* 다이어리 */}
          {latestDiary && (
            <div className="diary-card">
              <div className="diary-title">{latestDiary.name || '제목 없음'}</div>
              <div className="diary-content">{latestDiary.content || '내용이 없습니다.'}</div>
              {latestDiary.date && (
                <div className="diary-date">{latestDiary.date}</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="credit">
        Powered by Notion API + Next.js
      </div>
    </main>
  )
}
