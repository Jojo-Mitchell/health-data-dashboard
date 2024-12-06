import type { Metadata } from 'next'
import Disease from '@/components/dashboard/Disease'

export const metadata: Metadata = {
  title: 'COVID-19 Statistics Dashboard',
  description: 'Real-time COVID-19 statistics dashboard with global and country-level data.',
}

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <Disease />
    </main>
  )
}