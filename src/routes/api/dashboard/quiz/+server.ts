import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { easyChallenges, mediumChallenges, hardChallenges } from '$lib/server/db/schema';
import { quizzes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
    try {
        const { 
            title, 
            description, 
            answer, 
            explanation, 
            points, 
            difficulty, 
            quiz_type_id,
            category_id,
            time_limit,
            options 
        } = await request.json();
        
        let newChallenge;
        
        switch (difficulty.toLowerCase()) {
            case 'easy':
                newChallenge = await db.insert(easyChallenges).values({
                    title,
                    description,
                    answer,
                    explanation,
                    points: points || 10,
                    category_id,
                    quiz_type_id,
                    time_limit,
                    options,
                    difficulty: 'easy'
                }).returning().get();
                break;
                
            case 'medium':
                newChallenge = await db.insert(mediumChallenges).values({
                    title,
                    description,
                    answer,
                    explanation,
                    points: points || 20,
                    category_id,
                    quiz_type_id,
                    time_limit,
                    options,
                    difficulty: 'medium'
                }).returning().get();
                break;
                
            case 'hard':
                newChallenge = await db.insert(hardChallenges).values({
                    title,
                    description,
                    answer,
                    explanation,
                    points: points || 30,
                    category_id,
                    quiz_type_id,
                    time_limit,
                    options,
                    difficulty: 'hard'
                }).returning().get();
                break;
                
            default:
                throw new Error('Invalid difficulty level');
        }
        
        return json({ success: true, challenge: newChallenge });
    } catch (error) {
        console.error('Error creating challenge:', error);
        return json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
        }, { status: 400 });
    }
}

export async function GET({ url }) {
    try {
        const quizId = url.searchParams.get('id');
        const category = url.searchParams.get('category');

        console.log('Fetching quiz with ID:', quizId, 'and category:', category);

        if (!quizId || !category) {
            return json({ error: 'Quiz ID and category are required' }, { status: 400 });
        }

        // First try easy challenges
        let quiz = await db.query.easyChallenges.findFirst({
            where: eq(easyChallenges.id, parseInt(quizId))
        });

        console.log('Easy quiz search result:', quiz);

        // If not found, try medium challenges
        if (!quiz) {
            quiz = await db.query.mediumChallenges.findFirst({
                where: eq(mediumChallenges.id, parseInt(quizId))
            });
            console.log('Medium quiz search result:', quiz);
        }

        // If still not found, try hard challenges
        if (!quiz) {
            quiz = await db.query.hardChallenges.findFirst({
                where: eq(hardChallenges.id, parseInt(quizId))
            });
            console.log('Hard quiz search result:', quiz);
        }

        if (!quiz) {
            console.log('No quiz found with ID:', quizId);
            return json({ error: 'Quiz not found' }, { status: 404 });
        }

        console.log('Found quiz:', quiz);
        return json({ quiz });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
} 