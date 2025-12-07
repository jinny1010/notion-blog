import './globals.css'

export const metadata = {
  title: 'My Notion Blog',
  description: 'Notion API로 만든 개인 블로그',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
