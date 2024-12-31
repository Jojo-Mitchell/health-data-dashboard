'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleUser, AlertTriangle, Search, ActivitySquare, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
    ChartDataPoint,
    DateRangeOption,
    DiseaseCountryData,
    GlobalDiseaseData,
    MetricType,
    SortConfig, 
  } from '../../types/disease';

const ITEMS_PER_PAGE = 10;

const DashboardSkeleton = () => (
  <div className="space-y-6" data-testid="dashboard-skeleton">
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

const Disease = () => {
    const [data, setData] = useState<DiseaseCountryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('cases');
    const [dateRange, setDateRange] = useState<DateRangeOption>('30');
    const ITEMS_PER_PAGE = 10;
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://disease.sh/v3/covid-19/countries');
        const jsonData: DiseaseCountryData[] = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const formatNumber = (num: number): string => 
      new Intl.NumberFormat().format(num);
  
    const getChartData = (): ChartDataPoint[] => {
      return data.slice(0, 10).map(country => ({
        name: country.country,
        cases: country.cases,
        deaths: country.deaths,
        recovered: country.recovered,
        active: country.active
      }));
    };
  
    const sortData = (dataToSort: DiseaseCountryData[]): DiseaseCountryData[] => {
      if (sortConfig.length === 0) return dataToSort;
  
      return [...dataToSort].sort((a, b) => {
        for (const sort of sortConfig) {
          if (a[sort.key] !== b[sort.key]) {
            return sort.direction === 'asc' 
              ? (a[sort.key] as number) - (b[sort.key] as number)
              : (b[sort.key] as number) - (a[sort.key] as number);
          }
        }
        return 0;
      });
    };
  
    const handleSort = (key: keyof DiseaseCountryData) => {
      const newSortConfig = [...sortConfig];
      const configIndex = newSortConfig.findIndex(item => item.key === key);
  
      if (configIndex === -1) {
        newSortConfig.push({ key, direction: 'desc' });
      } else {
        if (newSortConfig[configIndex].direction === 'desc') {
          newSortConfig[configIndex].direction = 'asc';
        } else {
          newSortConfig.splice(configIndex, 1);
        }
      }
  
      setSortConfig(newSortConfig);
    };
  
    const getSortIndicator = (key: keyof DiseaseCountryData) => {
      const config = sortConfig.find(item => item.key === key);
      if (!config) return null;
      return config.direction === 'asc' ? 
        <ArrowUp className="w-4 h-4" /> : 
        <ArrowDown className="w-4 h-4" />;
    };
  
    const getFilteredAndPaginatedData = (): DiseaseCountryData[] => {
      let filteredData = data.filter(country => 
        country.country.toLowerCase().includes(filter.toLowerCase())
      );
      
      filteredData = sortData(filteredData);
  
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };
  
    const totalPages = Math.ceil(
      data.filter(country => 
        country.country.toLowerCase().includes(filter.toLowerCase())
      ).length / ITEMS_PER_PAGE
    );
  
    const globalStats: GlobalDiseaseData = data.reduce((acc, curr) => ({
      cases: acc.cases + curr.cases,
      deaths: acc.deaths + curr.deaths,
      recovered: acc.recovered + curr.recovered,
      active: acc.active + curr.active,
      updated: Date.now(),
      todayCases: acc.todayCases + curr.todayCases,
      todayDeaths: acc.todayDeaths + curr.todayDeaths,
      todayRecovered: acc.todayRecovered + curr.todayRecovered,
      critical: acc.critical + curr.critical,
      tests: acc.tests + curr.tests,
      population: acc.population + curr.population,
      affectedCountries: data.length
    }), {
      cases: 0,
      deaths: 0,
      recovered: 0,
      active: 0,
      updated: Date.now(),
      todayCases: 0,
      todayDeaths: 0,
      todayRecovered: 0,
      critical: 0,
      tests: 0,
      population: 0,
      affectedCountries: 0
    });
  
    if (loading) return <DashboardSkeleton />;
  
    return (
      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        <h1 className="text-6xl font-bold text-center mb-10 text-blue-900">
          Global COVID-19 Dashboard
        </h1>
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Total Cases",
              value: globalStats.cases,
              icon: <ActivitySquare className="h-8 w-8 text-blue-600" />,
              bgColor: "bg-blue-50",
              borderColor: "border-blue-200",
              textColor: "text-blue-700"
            },
            {
              title: "Active Cases",
              value: globalStats.active,
              icon: <CircleUser className="h-8 w-8 text-yellow-600" />,
              bgColor: "bg-yellow-50",
              borderColor: "border-yellow-200",
              textColor: "text-yellow-700"
            },
            {
              title: "Recovered",
              value: globalStats.recovered,
              icon: <CircleUser className="h-8 w-8 text-green-600" />,
              bgColor: "bg-green-50",
              borderColor: "border-green-200",
              textColor: "text-green-700"
            },
            {
              title: "Deaths",
              value: globalStats.deaths,
              icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
              bgColor: "bg-red-50",
              borderColor: "border-red-200",
              textColor: "text-red-700"
            }
          ].map((stat, index) => (
            <Card 
              key={index}
              className={`transform transition-all duration-200 hover:scale-105 border-2 ${stat.borderColor} ${stat.bgColor}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 mt-3 rounded-xl ${stat.bgColor}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-md font-bold text-gray-600">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>
                      {formatNumber(stat.value)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
          <Card>
            <CardHeader>
              <CardTitle>
                Top 10 Countries by {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={selectedMetric} fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cases" stroke="#8884d8" />
                    <Line type="monotone" dataKey="recovered" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
  
        <div className="flex flex-wrap gap-4 mb-6  text-blue-800 focus:text-blue-950" data-testid="sort-indicator">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search countries..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Select 
            value={selectedMetric} 
            onValueChange={(value: MetricType) => setSelectedMetric(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cases">Cases</SelectItem>
              <SelectItem value="deaths">Deaths</SelectItem>
              <SelectItem value="recovered">Recovered</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={dateRange}
            onValueChange={(value: DateRangeOption) => setDateRange(value)}
            >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
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
                  <tr className="border-b text-gray-600">
                    <th 
                      className="text-left p-4 font-medium cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('country')}
                    >
                      <div className="flex space-x-2">
                        <span>Country</span>
                        {getSortIndicator('country')}
                      </div>
                    </th>
                    {['cases', 'active', 'recovered', 'deaths'].map(field => (
                      <th 
                        key={field}
                        className="text-left p-4 font-medium cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort(field as keyof DiseaseCountryData)}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                          {getSortIndicator(field as keyof DiseaseCountryData)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {getFilteredAndPaginatedData().map(country => (
                    <tr key={country.country} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={country.countryInfo.flag} 
                            alt={`${country.country} flag`}
                            className="w-6 h-4 object-cover rounded shadow-sm"
                          />
                          <span className="font-medium text-gray-800">
                            {country.country}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        {formatNumber(country.cases)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          country.active < 1000 ? 'bg-green-100 text-green-800' :
                          country.active < 10000 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {formatNumber(country.active)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">
                        {formatNumber(country.recovered)}
                      </td>
                      <td className="p-4 text-gray-700">
                        {formatNumber(country.deaths)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            <div className="flex justify-between items-center mt-4">
              <div>
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {
                  Math.min(currentPage * ITEMS_PER_PAGE, data.length)
                } of {data.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border rounded hover:bg-blue-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 border rounded hover:bg-blue-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default Disease;