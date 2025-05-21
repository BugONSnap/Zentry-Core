import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { easyChallenges, mediumChallenges, hardChallenges } from '$lib/server/db/schema';

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