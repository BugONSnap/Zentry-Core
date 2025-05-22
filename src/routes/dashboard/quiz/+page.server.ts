import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { easyChallenges, mediumChallenges, hardChallenges } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
    const quizId = url.searchParams.get('id');
    const category = url.searchParams.get('category');

    if (!quizId || !category) {
        throw error(400, 'Quiz ID and category are required');
    }

    // First try easy challenges
    let quiz = await db.query.easyChallenges.findFirst({
        where: eq(easyChallenges.id, parseInt(quizId))
    });

    // If not found, try medium challenges
    if (!quiz) {
        quiz = await db.query.mediumChallenges.findFirst({
            where: eq(mediumChallenges.id, parseInt(quizId))
        });
    }

    // If still not found, try hard challenges
    if (!quiz) {
        quiz = await db.query.hardChallenges.findFirst({
            where: eq(hardChallenges.id, parseInt(quizId))
        });
    }

    if (!quiz) {
        throw error(404, 'Quiz not found');
    }

    return {
        quiz
    };
}; 