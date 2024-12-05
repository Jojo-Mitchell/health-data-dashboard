'use client'
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { Database, FileCheck, Users, AlertTriangle } from 'lucide-react'

type SystemData = {
  name: string
  completeness: number
  accessibility: number
  documentation: number
  dataQuality: number
  criticalIssues: number
  lastUpdated: string
  users: number
}

export default function DataAssessmentDashboard() {
  const [systems] = useState<SystemData[]>([
    {
      name: 'Environmental Health Database',
      completeness: 85,
      accessibility: 70,
      documentation: 60,
      dataQuality: 75,
      criticalIssues: 2,
      lastUpdated: '2024-03-15',
      users: 45
    },
    {
      name: 'Public Health Records System',
      completeness: 90,
      accessibility: 85,
      documentation: 80,
      dataQuality: 88,
      criticalIssues: 1,
      lastUpdated: '2024-03-20',
      users: 62
    },
    {
      name: 'Community Health Metrics',
      completeness: 65,
      accessibility: 55,
      documentation: 40,
      dataQuality: 60,
      criticalIssues: 4,
      lastUpdated: '2024-02-28',
      users: 28
    }
  ])

  const totalUsers = systems.reduce((sum, system) => sum + system.users, 0)
  const totalIssues = systems.reduce((sum, system) => sum + system.criticalIssues, 0)
  const avgDataQuality = Math.round(systems.reduce((sum, system) => sum + system.dataQuality, 0) / systems.length)

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Data Systems Assessment Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Systems</p>
                <p className="text-2xl font-bold">{systems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Data Quality</p>
                <p className="text-2xl font-bold">{avgDataQuality}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold">{totalIssues}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Metrics Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={systems}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completeness" fill="#3b82f6" name="Completeness" />
                <Bar dataKey="accessibility" fill="#10b981" name="Accessibility" />
                <Bar dataKey="documentation" fill="#8b5cf6" name="Documentation" />
                <Bar dataKey="dataQuality" fill="#f59e0b" name="Data Quality" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health Radar</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={systems}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Data Quality" dataKey="dataQuality" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Radar name="Completeness" dataKey="completeness" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Systems Table */}
      <Card>
        <CardHeader>
          <CardTitle>Systems Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">System Name</th>
                  <th className="text-left p-4 font-medium">Data Quality</th>
                  <th className="text-left p-4 font-medium">Users</th>
                  <th className="text-left p-4 font-medium">Critical Issues</th>
                  <th className="text-left p-4 font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {systems.map((system, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">{system.name}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              system.dataQuality >= 80 ? 'bg-green-600' :
                              system.dataQuality >= 60 ? 'bg-yellow-500' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${system.dataQuality}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{system.dataQuality}%</span>
                      </div>
                    </td>
                    <td className="p-4">{system.users}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        system.criticalIssues === 0 ? 'bg-green-100 text-green-800' :
                        system.criticalIssues <= 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {system.criticalIssues}
                      </span>
                    </td>
                    <td className="p-4">{system.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}