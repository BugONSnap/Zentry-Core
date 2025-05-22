import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users, userEasyProgress, userMediumProgress, userHardProgress } from '$lib/server/db/schema';
import { verifyToken } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get('session');
    
    if (!sessionToken) {
        throw redirect(302, '/');
    }

    try {
        // Verify the session token and get the user ID
        const payload = await verifyToken(sessionToken);
        
        if (!payload) {
            throw redirect(302, '/');
        }

        const userData = await db.query.users.findFirst({
            where: eq(users.id, payload.userId)
        });

        if (!userData) {
            throw redirect(302, '/');
        }

        // Get progress data for each difficulty level
        const easyProgress = await db.query.userEasyProgress.findMany({
            where: eq(userEasyProgress.user_id, payload.userId)
        });

        const mediumProgress = await db.query.userMediumProgress.findMany({
            where: eq(userMediumProgress.user_id, payload.userId)
        });

        const hardProgress = await db.query.userHardProgress.findMany({
            where: eq(userHardProgress.user_id, payload.userId)
        });

        // Calculate completed tasks for each category
        const htmlEasyCompleted = easyProgress.filter(p => p.completed).length;
        const htmlMediumCompleted = mediumProgress.filter(p => p.completed).length;
        const htmlHardCompleted = hardProgress.filter(p => p.completed).length;
        const totalHtmlCompleted = htmlEasyCompleted + htmlMediumCompleted + htmlHardCompleted;

        // Calculate progress percentages
        const htmlPercentage = Math.round((totalHtmlCompleted / 50) * 100);

        return {
            profile: {
                username: userData.username,
                email: userData.email,
                total_points: userData.total_points,
                rank: userData.rank || 'Beginner',
                progress: {
                    html: {
                        percentage: htmlPercentage,
                        completedTasks: totalHtmlCompleted,
                        totalTasks: 50,
                        level: Math.floor(totalHtmlCompleted / 10) + 1,
                        currentDifficulty: totalHtmlCompleted >= 40 ? 'Advanced' : 
                                         totalHtmlCompleted >= 20 ? 'Intermediate' : 'Beginner'
                    },
                    css: {
                        percentage: 0,
                        completedTasks: 0,
                        totalTasks: 50,
                        level: 1,
                        currentDifficulty: 'Beginner'
                    },
                    javascript: {
                        percentage: 0,
                        completedTasks: 0,
                        totalTasks: 50,
                        level: 1,
                        currentDifficulty: 'Beginner'
                    }
                }
            }
        };
    } catch (error) {
        console.error('Error loading profile data:', error);
        throw redirect(302, '/');
    }
}; 