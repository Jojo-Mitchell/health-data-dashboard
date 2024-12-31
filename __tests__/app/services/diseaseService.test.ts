import { diseaseService } from '../disease-service'
import { server } from '@/test/mocks/server'
import { http, HttpResponse, delay } from 'msw'
import { mockDiseaseData, mockGlobalData } from '@/test/mocks/handlers'

describe('DiseaseService', () => {
  describe('getCountries', () => {
    test('returns country data successfully', async () => {
      const data = await diseaseService.getCountries()
      expect(data).toEqual(mockDiseaseData)
    })

    test('caches data for subsequent calls', async () => {
      // First call
      const firstCall = await diseaseService.getCountries()
      
      // Second call should use cached data
      const secondCall = await diseaseService.getCountries()
      
      expect(firstCall).toEqual(secondCall)
      // Verify only one network request was made
      const requests = server.listHandlers().filter(
        handler => handler.info.path === '/countries'
      )
      expect(requests).toHaveLength(1)
    })

    test('handles rate limiting with retry', async () => {
      let attempts = 0
      server.use(
        http.get('https://disease.sh/v3/covid-19/countries', () => {
          attempts++
          if (attempts === 1) {
            return new HttpResponse(null, { 
              status: 429,
              headers: {
                'Retry-After': '1'
              }
            })
          }
          return HttpResponse.json(mockDiseaseData)
        })
      )

      const data = await diseaseService.getCountries()
      expect(data).toEqual(mockDiseaseData)
      expect(attempts).toBe(2)
    })

    test('handles malformed JSON response', async () => {
      server.use(
        http.get('https://disease.sh/v3/covid-19/countries', () => {
          return new HttpResponse('invalid json', {
            headers: { 'Content-Type': 'application/json' }
          })
        })
      )

      await expect(diseaseService.getCountries())
        .rejects.toThrow('Invalid JSON response')
    })

    test('handles timeout', async () => {
      server.use(
        http.get('https://disease.sh/v3/covid-19/countries', async () => {
          await delay(3000) // Longer than timeout
          return HttpResponse.json(mockDiseaseData)
        })
      )

      await expect(diseaseService.getCountries())
        .rejects.toThrow('Request timeout')
    })
  })

  describe('getGlobalData', () => {
    test('returns global data with calculated metrics', async () => {
      const data = await diseaseService.getGlobalData()
      expect(data).toEqual(mockGlobalData)
      
      // Verify calculated fields
      expect(data).toHaveProperty('deathRate')
      expect(data).toHaveProperty('recoveryRate')
      expect(data.deathRate).toBe((data.deaths / data.cases) * 100)
    })

    test('handles empty response data', async () => {
      server.use(
        http.get('https://disease.sh/v3/covid-19/all', () => {
          return HttpResponse.json({})
        })
      )

      await expect(diseaseService.getGlobalData())
        .rejects.toThrow('Invalid global data format')
    })

    test('validates data structure', async () => {
      server.use(
        http.get('https://disease.sh/v3/covid-19/all', () => {
          return HttpResponse.json({ 
            cases: 'invalid', // Should be number
            deaths: 100 
          })
        })
      )

      await expect(diseaseService.getGlobalData())
        .rejects.toThrow('Invalid data type')
    })
  })

  describe('getCountryData', () => {
    test('returns single country data with enriched metrics', async () => {
      const data = await diseaseService.getCountryData('USA')
      expect(data).toEqual(mockDiseaseData[0])
      
      // Verify enriched data
      expect(data).toHaveProperty('casesPerMillion')
      expect(data).toHaveProperty('deathsPerMillion')
    })

    test('handles special characters in country names', async () => {
      const specialCountry = { 
        ...mockDiseaseData[0],
        country: 'Côte d\'Ivoire'
      }
      
      server.use(
        http.get('https://disease.sh/v3/covid-19/countries/C%C3%B4te%20d%27Ivoire', () => {
          return HttpResponse.json(specialCountry)
        })
      )

      const data = await diseaseService.getCountryData('Côte d\'Ivoire')
      expect(data).toEqual(specialCountry)
    })

    test('validates country name input', async () => {
      await expect(diseaseService.getCountryData(''))
        .rejects.toThrow('Country name is required')
      
      await expect(diseaseService.getCountryData(' '))
        .rejects.toThrow('Country name is required')
    })

    test('handles concurrent requests for same country', async () => {
      const promises = [
        diseaseService.getCountryData('USA'),
        diseaseService.getCountryData('USA')
      ]

      const results = await Promise.all(promises)
      expect(results[0]).toEqual(results[1])
      // Verify only one network request was made
      const requests = server.listHandlers().filter(
        handler => handler.info.path.includes('/countries/USA')
      )
      expect(requests).toHaveLength(1)
    })
  })

  describe('error handling', () => {
    test('retries on network failure', async () => {
      let attempts = 0
      server.use(
        http.get('https://disease.sh/v3/covid-19/countries', () => {
          attempts++
          if (attempts === 1) {
            throw new Error('Network error')
          }
          return HttpResponse.json(mockDiseaseData)
        })
      )

      const data = await diseaseService.getCountries()
      expect(data).toEqual(mockDiseaseData)
      expect(attempts).toBe(2)
    })

    test('handles CORS errors', async () => {
      server.use(
        http.get('https://disease.sh/v3/covid-19/countries', () => {
          return new HttpResponse(null, { status: 403 })
        })
      )

      await expect(diseaseService.getCountries())
        .rejects.toThrow('Access denied')
    })

    test('clears cache on error', async () => {
      // First successful call
      await diseaseService.getCountries()

      // Error on second call
      server.use(
        http.get('https://disease.sh/v3/covid-19/countries', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(diseaseService.getCountries()).rejects.toThrow()
      
      // Verify cache was cleared
      expect(diseaseService['cache'].size).toBe(0)
    })
  })
})