import './globals.css'

export const metadata = {
  title: 'My Profile',
  description: 'Notion-powered personal page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
