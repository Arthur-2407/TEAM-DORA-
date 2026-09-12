import type { Metadata } from 'next';
import { Orbitron, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastContainer } from '@/components/ui/Toast';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NEXUS PROTOCOL — Life RPG',
  description: 'Transform your daily tasks into epic missions. Level up your real life with gamified productivity tracking, XP progression, streaks, and rewards.',
  keywords: ['life rpg', 'gamification', 'productivity', 'habit tracker', 'task manager', 'leveling system'],
  authors: [{ name: 'Nexus Protocol' }],
  openGraph: {
    title: 'NEXUS PROTOCOL — Life RPG',
    description: 'Transform your daily tasks into epic missions. Level up your real life.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <body className="scanline-overlay">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
