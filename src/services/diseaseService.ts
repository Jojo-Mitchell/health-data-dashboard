import { SystemData, SystemMetrics, SystemFilters } from '../types/system';
import { DiseaseCountryData } from '../types/disease';

class DiseaseService {
  private readonly BASE_URL = 'https://disease.sh/v3/covid-19';

  private transformCountryData(data: DiseaseCountryData): SystemData {
    const testsPerMillion = (data.tests / data.population) * 1000000;
    const recoveryRate = (data.recovered / data.cases) * 100;
    const activeRate = (data.active / data.cases) * 100;

    return {
      name: data.country,
      completionRanking: Math.min(Math.round((testsPerMillion / 5000) * 100), 100),
      accessibility: Math.round(((Date.now() - data.updated) < 86400000) ? 90 : 70),
      documentation: 75,
      dataQuality: Math.round((recoveryRate + (100 - activeRate)) / 2),
      criticalIssues: Math.min(Math.ceil(data.critical / 1000), 5),
      lastUpdated: new Date(data.updated).toISOString().split('T')[0],
      users: Math.round(data.active / 1000)
    };
  }

  async getSystems(filters?: SystemFilters): Promise<SystemData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/countries`);
      const data: DiseaseCountryData[] = await response.json();
      
      let transformedData = data.map(country => this.transformCountryData(country));

      if (filters) {
        if (filters.search) {
          transformedData = transformedData.filter(system =>
            system.name.toLowerCase().includes(filters.search!.toLowerCase())
          );
        }
        if (filters.minDataQuality) {
          transformedData = transformedData.filter(system =>
            system.dataQuality >= filters.minDataQuality!
          );
        }
        if (filters.maxCriticalIssues) {
          transformedData = transformedData.filter(system =>
            system.criticalIssues <= filters.maxCriticalIssues!
          );
        }
      }

      return transformedData;
    } catch (error) {
      console.error('Error fetching disease data:', error);
      return [];
    }
  }

  async getMetrics(): Promise<SystemMetrics> {
    const systems = await this.getSystems();
    return {
      totalSystems: systems.length,
      totalUsers: systems.reduce((sum, system) => sum + system.users, 0),
      averageDataQuality: Math.round(
        systems.reduce((sum, system) => sum + system.dataQuality, 0) / systems.length
      ),
      totalCriticalIssues: systems.reduce((sum, system) => sum + system.criticalIssues, 0)
    };
  }

  async getSystem(name: string): Promise<SystemData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/countries/${name}`);
      const data: DiseaseCountryData = await response.json();
      return this.transformCountryData(data);
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error);
      return null;
    }
  }
}

export const diseaseService = new DiseaseService();