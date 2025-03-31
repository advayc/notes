import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import GridBackground from '@/components/ui/grid-background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NoteApp - Your Personal Note-Taking App',
  description: 'Create, organize, and access your notes from anywhere. Simple, secure, and beautiful.',
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
