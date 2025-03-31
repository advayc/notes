import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import GridBackground from '@/components/ui/grid-background';

const inter = Inter({ subsets: ['latin'] });

// App information
const appName = 'NotesApp';
const appDescription = 'Create, organize, and access your notes from anywhere. Simple, secure, and beautiful.';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://notes-app.com';

// SEO metadata
export const metadata: Metadata = {
  title: 'NotesApp - Your Personal Note-Taking App',
  description: appDescription,
  icons: {
    icon: [
      { url: 'images/logo.png', sizes: '32x32' },
      { url: 'images/logo.png', sizes: '16x16' }
    ],
    apple: { url: '/logo.png' },
    shortcut: { url: '/logo.png' }
  },
  themeColor: '#10b981',
};

// Viewport metadata
export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="min-h-screen bg-black text-emerald-500">
          <GridBackground gridColor="#22c55e" gridOpacity={0.03}>
            <Navbar />
            <main>{children}</main>
          </GridBackground>
        </div>
      </body>
    </html>
  );
}
