// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, background: '#010409' }}>
        {children}
      </body>
    </html>
  )
}