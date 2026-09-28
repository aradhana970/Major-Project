import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CampusCustomizer } from '@/components/ui/CampusCustomizer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CampusKart – ID-Based Verified Student E-Commerce Marketplace',
  description: 'Verified student-only marketplace for textbooks, lab coats, calculators, and engineering project materials. Developed under guidance of Prathamesh Sir.',
  keywords: ['CampusKart', 'Student Marketplace', 'Verified Student E-Commerce', 'Diploma Major Project', 'Groq AI Listing'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CampusCustomizer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
