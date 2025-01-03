import type { Metadata } from 'next'
import Disease from '@/components/dashboard/Disease'
import { Noto_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'COVID-19 Statistics Dashboard',
  description: 'Real-time COVID-19 statistics dashboard with global and country-level data.',
}

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Include the weights you need
  display: 'swap',
});

export default function Home() {
  return (
    <main className={`${notoSans.className} min-h-screen p-4 bg-gray-50`}>
      <Disease />
    </main>
  )
}