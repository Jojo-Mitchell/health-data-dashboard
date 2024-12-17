# COVID-19 Global Dashboard
A modern, interactive dashboard built with Next.js for tracking and visualizing global COVID-19 statistics. Features real-time data visualization, country comparisons, and comprehensive statistical analysis using the disease.sh API.

## Features
* **Global Statistics Overview**
  * Total cases, active cases, recoveries, and deaths
  * Real-time updates from disease.sh API
  * Visual metrics cards with trend indicators

* **Country-Level Analysis**
  * Detailed country-wise statistics
  * Interactive data tables with multi-column sorting
  * Flag and region-based filtering
  * Pagination for better data navigation

* **Data Visualization**
  * Top 10 countries comparative charts
  * Trend analysis with line charts
  * Interactive tooltips and legends
  * Responsive chart layouts

* **Advanced Filtering**
  * Multi-metric sorting capabilities
  * Date range selection
  * Country name search
  * Custom metric selection

## Tech Stack
|  | |
| ------------- |:-------------|
| Framework  | Next.js 14 with TypeScript  |
| Styling      | Tailwind CSS   |
| Components    | shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |
| API | disease.sh |

## Project Structure
src/
├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── Disease.tsx
│   │   └── ui/
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── skeleton.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── utils.ts
├── services/
│   └── diseaseService.ts
└── types/
├── disease.ts
└── system.ts

## Prerequisites
- Node.js 20.17.0 or later
- npm/yarn package manager

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/covid19-dashboard.git
```

2. Navigate to the project directory
```bash
cd covid19-dashboard
```

3. Install dependencies
```bash
npm install
```

4. Run the development server
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser to view the dashboard


## Environment Variables
Create a .env.local file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://disease.sh/v3/covid-19
```

## API Integration
The dashboard uses the disease.sh API for COVID-19 data:

/countries - Country-specific statistics
/all - Global statistics

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

Acknowledgments

/disease.sh for providing the COVID-19 API
/shadcn/ui for the component library
/Recharts for chart components
