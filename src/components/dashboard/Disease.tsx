'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleUser, AlertTriangle, Search, ActivitySquare } from "lucide-react";

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const DiseaseDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('cases');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://disease.sh/v3/covid-19/countries');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  if (loading) return <DashboardSkeleton />;

  const filteredData = data
    .filter(country => 
      country.country.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const globalStats = data.reduce((acc, curr) => ({
    cases: acc.cases + curr.cases,
    deaths: acc.deaths + curr.deaths,
    recovered: acc.recovered + curr.recovered,
    active: acc.active + curr.active
  }), { cases: 0, deaths: 0, recovered: 0, active: 0 });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Global COVID-19 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ActivitySquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold">{formatNumber(globalStats.cases)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CircleUser className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold">{formatNumber(globalStats.active)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CircleUser className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Recovered</p>
                <p className="text-2xl font-bold">{formatNumber(globalStats.recovered)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Deaths</p>
                <p className="text-2xl font-bold">{formatNumber(globalStats.deaths)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="pl-8"
            placeholder="Search countries..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cases">Total Cases</SelectItem>
            <SelectItem value="active">Active Cases</SelectItem>
            <SelectItem value="recovered">Recovered</SelectItem>
            <SelectItem value="deaths">Deaths</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Country Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Country</th>
                  <th className="text-left p-4 font-medium">Total Cases</th>
                  <th className="text-left p-4 font-medium">Active</th>
                  <th className="text-left p-4 font-medium">Recovered</th>
                  <th className="text-left p-4 font-medium">Deaths</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.map(country => (
                  <tr key={country.country} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={country.countryInfo.flag} 
                          alt={`${country.country} flag`}
                          className="w-6 h-4 object-cover"
                        />
                        <span className="font-medium">{country.country}</span>
                      </div>
                    </td>
                    <td className="p-4">{formatNumber(country.cases)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        country.active < 1000 ? 'bg-green-100 text-green-800' :
                        country.active < 10000 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {formatNumber(country.active)}
                      </span>
                    </td>
                    <td className="p-4">{formatNumber(country.recovered)}</td>
                    <td className="p-4">{formatNumber(country.deaths)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiseaseDashboard;