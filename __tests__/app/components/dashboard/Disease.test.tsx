import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Disease from '@/components/dashboard/Disease';
import type { DiseaseCountryData } from '@/types/disease';

const mockDiseaseData: DiseaseCountryData[] = [
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
];

describe('Disease Dashboard', () => {
  test('renders loading skeleton initially', () => {
    render(<Disease />);
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  test('displays dashboard after loading', async () => {
    render(<Disease />);
    
    await waitFor(() => {
      expect(screen.getByText('Global COVID-19 Dashboard')).toBeInTheDocument();
    });

    // Check for key metrics
    expect(screen.getByText('1,000,000')).toBeInTheDocument(); // Total cases USA
    expect(screen.getByText('Total Cases')).toBeInTheDocument();
  });

  test('filters countries by search input', async () => {
    render(<Disease />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search countries...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search countries...');
    fireEvent.change(searchInput, { target: { value: 'USA' } });

    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.queryByText('India')).not.toBeInTheDocument();
  });

  test('changes metric type in chart', async () => {
    render(<Disease />);
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const metricSelect = screen.getByRole('combobox');
    fireEvent.change(metricSelect, { target: { value: 'deaths' } });

    expect(screen.getByText('Top 10 Countries by Deaths')).toBeInTheDocument();
  });

  test('changes date range', async () => {
    render(<Disease />);
    
    await waitFor(() => {
      const dateRangeSelect = screen.getAllByRole('combobox')[1];
      expect(dateRangeSelect).toBeInTheDocument();
      
      fireEvent.change(dateRangeSelect, { target: { value: '7' } });
      expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    });
  });

  test('sorts data by column', async () => {
    render(<Disease />);
    
    await waitFor(() => {
      const casesHeader = screen.getByText('Cases');
      fireEvent.click(casesHeader);
      
      // Check if USA (with more cases) appears before India
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('USA');
      expect(rows[2]).toHaveTextContent('India');
      
      // Click again to reverse sort
      fireEvent.click(casesHeader);
      expect(rows[1]).toHaveTextContent('India');
      expect(rows[2]).toHaveTextContent('USA');
    });
  });

  test('handles pagination', async () => {
    render(<Disease />);
    
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });

  test('displays error state when fetch fails', async () => {
    // MSW will already handle this through the handlers
    render(<Disease />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error loading data/)).toBeInTheDocument();
    });
  });
});