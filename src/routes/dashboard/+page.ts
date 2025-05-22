import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        
        return {
            leaderboard: data.users.map((user: any, index: number) => ({
                name: user.username,
                xp: user.total_points,
                ranking: index + 1
            }))
        };
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        return {
            leaderboard: []
        };
    }
}; 