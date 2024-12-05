'use client'

import React, { useState, useEffect, use } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Database, FileCheck, Users, AlertTriangle } from 'lucide-react';
import { SystemData, SystemMetrics } from '@/types/system';
import { systemService } from '@/services/systemService';

export default function DataAssessmentDashboard() {
  const [systems, setSystems] = useState<SystemData[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [systemsData, metricsData] = await Promise.all([
          systemService.getSystems(),
          systemService.getMetrics()
        ]);

        setSystems(systemsData);
        setMetrics(metricsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error} </div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Data Systems Assessment Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Systems</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.totalSystems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Data Quality</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.averageDataQuality}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.totalCriticalIssues}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-gray-800">System Metrics Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={systems}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="completeness" fill="#3b82f6" name="Completeness" />
                <Bar dataKey="accessibility" fill="#10b981" name="Accessibility" />
                <Bar dataKey="documentation" fill="#8b5cf6" name="Documentation" />
                <Bar dataKey="dataQuality" fill="#f59e0b" name="Data Quality" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Systems Table */}
      <Card className="shadow-md">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-gray-800">Systems Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">System Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Data Quality</th>
                  <th className="text-left p-4 font-medium text-gray-700">Users</th>
                  <th className="text-left p-4 font-medium text-gray-700">Critical Issues</th>
                  <th className="text-left p-4 font-medium text-gray-700">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {systems.map((system, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-900 font-medium">{system.name}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              system.dataQuality >= 80 ? 'bg-green-500' :
                              system.dataQuality >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${system.dataQuality}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-700 font-medium">{system.dataQuality}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{system.users}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        system.criticalIssues === 0 ? 'bg-green-100 text-green-700' :
                        system.criticalIssues <= 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {system.criticalIssues}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{system.lastUpdated}</td>
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