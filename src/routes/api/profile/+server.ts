import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users, quizResults, easyChallenges, mediumChallenges, hardChallenges } from '$lib/server/db/schema';
import { verifyToken } from '$lib/server/auth';

export async function GET({ locals, cookies }) {
    try {
        // Get user ID from session cookie
        const sessionToken = cookies.get('session');
        if (!sessionToken) {
            console.log('No session found');
            return json({ error: 'Unauthorized - No session found' }, { status: 401 });
        }

        // Verify the session token and get the user ID
        const payload = await verifyToken(sessionToken);
        if (!payload) {
            return json({ error: 'Invalid session' }, { status: 401 });
        }

        const userId = payload.userId;

        // Fetch user data
        const userData = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        console.log('User data found:', !!userData);

        if (!userData) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch quiz results for each difficulty level
        const easyResults = await db.select()
            .from(quizResults)
            .where(eq(quizResults.user_id, userId))
            .leftJoin(easyChallenges, eq(quizResults.quiz_id, easyChallenges.id));

        const mediumResults = await db.select()
            .from(quizResults)
            .where(eq(quizResults.user_id, userId))
            .leftJoin(mediumChallenges, eq(quizResults.quiz_id, mediumChallenges.id));

        const hardResults = await db.select()
            .from(quizResults)
            .where(eq(quizResults.user_id, userId))
            .leftJoin(hardChallenges, eq(quizResults.quiz_id, hardChallenges.id));

        // Combine all results
        const allResults = [
            ...easyResults.map(r => ({ ...r, difficulty: 'easy' })),
            ...mediumResults.map(r => ({ ...r, difficulty: 'medium' })),
            ...hardResults.map(r => ({ ...r, difficulty: 'hard' }))
        ];

        console.log('Quiz results found:', allResults.length);

        // Calculate progress for each category
        const progress = {
            css: calculateProgress(allResults, 2), // CSS category_id is 2
            html: calculateProgress(allResults, 1), // HTML category_id is 1
            javascript: calculateProgress(allResults, 3) // JavaScript category_id is 3
        };

        return json({
            username: userData.username,
            email: userData.email,
            total_points: userData.total_points,
            rank: userData.rank,
            progress
        });
    } catch (error) {
        console.error('Error in profile API:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}

function calculateProgress(results: any[], categoryId: number) {
    const categoryQuizzes = results.filter(result => {
        const quiz = result.easy_challenges || result.medium_challenges || result.hard_challenges;
        return quiz && quiz.category_id === categoryId;
    });

    const completedTasks = categoryQuizzes.length;
    const totalTasks = 50; // You might want to fetch this from your database
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    
    // Calculate level based on completed tasks
    const level = Math.floor(completedTasks / 10) + 1;
    
    // Determine difficulty based on level
    let currentDifficulty = 'Beginner';
    if (level >= 4) currentDifficulty = 'Advanced';
    else if (level >= 2) currentDifficulty = 'Intermediate';

    // Get the last completed quiz
    const lastCompleted = categoryQuizzes
        .sort((a, b) => new Date(b.quiz_results.completed_at).getTime() - new Date(a.quiz_results.completed_at).getTime())
        .map(result => {
            const quiz = result.easy_challenges || result.medium_challenges || result.hard_challenges;
            return quiz?.title || 'None';
        })[0] || 'None';

    return {
        percentage,
        level,
        currentDifficulty,
        completedTasks,
        totalTasks,
        lastCompleted
    };
}

function getCategoryId(category: string): number {
    switch (category.toLowerCase()) {
        case 'html':
            return 1;
        case 'css':
            return 2;
        case 'javascript':
            return 3;
        default:
            return 0;
    }
} 
} 