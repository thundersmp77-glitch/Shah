import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Providers } from './Providers';

export const metadata: Metadata = {
  title: 'StudentHub | Organize your studies',
  description: 'Study schedules, assignments, and daily routines.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

