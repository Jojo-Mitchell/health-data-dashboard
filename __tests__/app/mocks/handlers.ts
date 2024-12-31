import { http, HttpResponse, delay } from 'msw'
import type { DiseaseCountryData, GlobalDiseaseData } from '@/types/disease'

export const mockDiseaseData: DiseaseCountryData[] = [
  {
    country: "USA",
    countryInfo: {
      _id: 840,
      iso2: "US",
      iso3: "USA",
      lat: 38,
      long: -97,
      flag: "https://disease.sh/assets/img/flags/us.png"
    },
    cases: 1000000,
    todayCases: 1000,
    deaths: 50000,
    todayDeaths: 50,
    recovered: 900000,
    todayRecovered: 900,
    active: 50000,
    critical: 1000,
    tests: 15000000,
    testsPerOneMillion: 45317,
    population: 331002651,
    updated: 1639762431891
  },
  {
    country: "India",
    countryInfo: {
      _id: 356,
      iso2: "IN",
      iso3: "IND",
      lat: 20,
      long: 77,
      flag: "https://disease.sh/assets/img/flags/in.png"
    },
    cases: 800000,
    todayCases: 800,
    deaths: 40000,
    todayDeaths: 40,
    recovered: 700000,
    todayRecovered: 700,
    active: 60000,
    critical: 800,
    tests: 10000000,
    testsPerOneMillion: 7246,
    population: 1380004385,
    updated: 1639762431891
  }
]

export const mockGlobalData: GlobalDiseaseData = {
  updated: 1639762431891,
  cases: 1800000,
  todayCases: 1800,
  deaths: 90000,
  todayDeaths: 90,
  recovered: 1600000,
  todayRecovered: 1600,
  active: 110000,
  critical: 1800,
  tests: 25000000,
  population: 1711007036
}

const coronavirusUrl = 'https://disease.sh/v3/covid-19'

export const handlers = [
  // Success handlers
  http.get(`${coronavirusUrl}/countries`, async () => {
    await delay(100) // Simulate network delay
    return HttpResponse.json(mockDiseaseData)
  }),

  http.get(`${coronavirusUrl}/all`, async () => {
    await delay(100)
    return HttpResponse.json(mockGlobalData)
  }),

  http.get(`${coronavirusUrl}/countries/:country`, async ({ params }) => {
    await delay(100)
    const country = mockDiseaseData.find(
      data => data.country.toLowerCase() === params.country.toLowerCase()
    )
    if (!country) {
      return new HttpResponse(null, { 
        status: 404,
        statusText: 'Country not found'
      })
    }
    return HttpResponse.json(country)
  }),

  // Error handlers
  http.get(`${coronavirusUrl}/countries/error`, async () => {
    await delay(100)
    return new HttpResponse(null, { 
      status: 500,
      statusText: 'Internal Server Error'
    })
  }),

  // Rate limit handler
  http.get(`${coronavirusUrl}/ratelimit`, async () => {
    await delay(100)
    return new HttpResponse(null, { 
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Retry-After': '5'
      }
    })
  })
]