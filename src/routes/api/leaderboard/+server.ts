import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        // Fetch top 10 users ordered by total points
        const topUsers = await db
            .select({
                username: users.username,
                total_points: users.total_points,
                rank: users.rank
            })
            .from(users)
            .orderBy(desc(users.total_points))
            .limit(10);

        return json({
            users: topUsers
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}