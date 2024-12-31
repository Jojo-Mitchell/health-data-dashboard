import { DiseaseCountryData, GlobalDiseaseData } from '../types/disease'

class DiseaseService {
  private readonly CORONAVIRUS_URL = 'https://disease.sh/v3/covid-19'

  async getCountries(): Promise<DiseaseCountryData[]> {
    try {
      const response = await fetch(`${this.CORONAVIRUS_URL}/countries`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching country data:', error)
      throw error
    }
  }

  async getGlobalData(): Promise<GlobalDiseaseData> {
    try {
      const response = await fetch(`${this.CORONAVIRUS_URL}/all`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching global data:', error)
      throw error
    }
  }

  async getCountryData(countryName: string): Promise<DiseaseCountryData> {
    try {
      const response = await fetch(`${this.CORONAVIRUS_URL}/countries/${encodeURIComponent(countryName)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching data for ${countryName}:`, error)
      throw error
    }
  }
}

export const diseaseService = new DiseaseService()