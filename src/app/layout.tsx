import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AQUA DIVE CO - Premium Scuba Gear',
  description: 'Professional scuba diving equipment and AI-powered customer support'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
