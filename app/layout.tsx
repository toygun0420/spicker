import './globals.css';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'SPICKER | 프리미엄 스포츠 배팅 커뮤니티',
  description: 'AI 기반 실시간 배당 폭락 감지 및 쉐어벳 트래커',
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning은 테마 전환 시 발생하는 경고를 숨겨줍니다.
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}