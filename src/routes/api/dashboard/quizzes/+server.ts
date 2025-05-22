import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { easyChallenges, mediumChallenges, hardChallenges } from '$lib/server/db/schema';

export async function GET({ url }) {
    try {
        // Get the category from query params
        const category = url.searchParams.get('category') || 'html';

        // Fetch quizzes from all difficulty levels
        const easyQuizzes = await db.query.easyChallenges.findMany({
            where: (challenges, { eq }) => eq(challenges.category_id, 1) // HTML category
        });

        const mediumQuizzes = await db.query.mediumChallenges.findMany({
            where: (challenges, { eq }) => eq(challenges.category_id, 1) // HTML category
        });

        const hardQuizzes = await db.query.hardChallenges.findMany({
            where: (challenges, { eq }) => eq(challenges.category_id, 1) // HTML category
        });

        // Return quizzes grouped by difficulty
        return json({
            easy: easyQuizzes,
            medium: mediumQuizzes,
            hard: hardQuizzes
        });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return json({ error: 'Failed to fetch quizzes' }, { status: 500 });
    }
} 