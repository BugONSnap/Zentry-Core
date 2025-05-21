import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { easyChallenges, mediumChallenges, hardChallenges } from '$lib/server/db/schema';

export async function GET() {
    try {
        const [easy, medium, hard] = await Promise.all([
            db.select().from(easyChallenges),
            db.select().from(mediumChallenges),
            db.select().from(hardChallenges)
        ]);

        return json({
            easy,
            medium,
            hard
        });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return json({ error: 'Failed to fetch quizzes' }, { status: 500 });
    }
} 