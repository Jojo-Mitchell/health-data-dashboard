import { SystemData, SystemFilters, SystemMetrics } from "../types/system";

const MOCK_DATA: SystemData[] = [
    {
        name: 'Environmental Health Database',
        completionRanking: 87,
        accessibility: 72,
        documentation: 59,
        dataQuality: 75,
        criticalIssues: 2,
        lastUpdated: '2024-03-15',
        users: 45
    },
    {
        name: 'Public Health Records System',
        completionRanking: 91,
        accessibility: 84,
        documentation: 79,
        dataQuality: 89,
        criticalIssues: 1,
        lastUpdated: '2024-03-20',
        users: 66
    },
    {
        name: 'Community Health Metrics',
        completionRanking: 62,
        accessibility: 54,
        documentation: 39,
        dataQuality: 67,
        criticalIssues: 4,
        lastUpdated: '2024-02-28',
        users: 26
    },
];

export const systemService = {
    // Retrieve results of all systems w/optional filter(s)
    async getSystems(filters?: SystemFilters): Promise<SystemData[]> {
        // Imitate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        let filteredData = [...MOCK_DATA];

        if (filters) {
            if (filters.search) {
                filteredData = filteredData.filter(system =>
                    system.name.toLowerCase().includes(filters.search!.toLowerCase())
                );
            }

            if (filters.minDataQuality) {
                filteredData = filteredData.filter(system =>
                    system.dataQuality >= filters.minDataQuality!
                );
            }

            if (filters.maxCriticalIssues) {
                filteredData = filteredData.filter(system => 
                    system.criticalIssues <= filters.maxCriticalIssues!
                );
            }
        }
        return filteredData;
    },

    async getMetrics(): Promise<SystemMetrics> {
        const systems = await this.getSystems();

        return {
            totalSystems: systems.length,
            totalUsers: systems.reduce((sum, system) => sum + system.users, 0),
            averageDataQuality: Math.round(
                systems.reduce((sum, system) => sum + system.dataQuality, 0)/ systems.length
            ),
            totalCriticalIssues: systems.reduce((sum, system) => sum + system.criticalIssues, 0)
        };
    },

    async getSystem(name: string): Promise<SystemData | null> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_DATA.find(system => system.name === name) || null;
    }
}


