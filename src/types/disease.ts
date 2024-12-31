export interface ChartDataPoint {
  name: string;
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
}

export type DateRangeOption = '7' | '30' | '90';

export interface DiseaseCountryData {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  updated: number;
}

export interface GlobalDiseaseData {
  updated: number;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  tests: number;
  population: number;
  affectedCountries: number;
}

export type MetricType = 'cases' | 'deaths' | 'recovered' | 'active';

export interface SortConfig {
  key: keyof DiseaseCountryData;
  direction: 'asc' | 'desc';
}