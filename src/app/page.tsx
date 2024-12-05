import type { Metadata } from 'next'
import DataAssessmentDashboard from '@/components/dashboard/DataAssessmentDashboard'

export const metadata: Metadata = {
  title: 'Data Systems Assessment Dashboard',
  description: 'Assessment dashboard for DOH data systems and metrics',
}

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <DataAssessmentDashboard />
    </main>
  )
}