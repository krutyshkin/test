import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Telegram Gift Market',
  description: 'Custom gift market for Telegram',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
