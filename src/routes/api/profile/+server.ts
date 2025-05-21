import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users, quizResults, quizzes } from '$lib/server/db/schema';

export async function GET({ locals, cookies }) {
    try {
        // Get user ID from session cookie
        const userId = cookies.get('userId');
        console.log('Session user ID:', userId);

        if (!userId) {
            console.log('No user ID found in session');
            return json({ error: 'Unauthorized - No session found' }, { status: 401 });
        }

        // Fetch user data
        const userData = await db.query.users.findFirst({
            where: eq(users.id, parseInt(userId))
        });

        console.log('User data found:', !!userData);

        if (!userData) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch quiz results for the user
        const results = await db.select()
            .from(quizResults)
            .where(eq(quizResults.user_id, parseInt(userId)))
            .leftJoin(quizzes, eq(quizResults.quiz_id, quizzes.id));

        console.log('Quiz results found:', results.length);

        // Calculate progress for each category
        const progress = {
            css: calculateProgress(results, 2), // CSS category_id is 2
            html: calculateProgress(results, 1), // HTML category_id is 1
            javascript: calculateProgress(results, 3) // JavaScript category_id is 3
        };

        return json({
            username: userData.username,
            email: userData.email,
            progress
        });
    } catch (error) {
        console.error('Error in profile API:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}

function calculateProgress(results: any[], categoryId: number) {
    const categoryQuizzes = results.filter(result => 
        result.quizzes.category_id === categoryId
    );

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
        .sort((a, b) => new Date(b.quiz_results.completed_at).getTime() - new Date(a.quiz_results.completed_at).getTime())[0]?.quizzes.title || 'None';

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