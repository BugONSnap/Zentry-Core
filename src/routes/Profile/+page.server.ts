import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
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

        // Default progress structure
        const defaultProgress = {
            percentage: 0,
            completedTasks: 0,
            totalTasks: 50
        };

        return {
            profile: {
                username: userData.username,
                email: userData.email,
                rank: userData.rank || 'Beginner',
                progress: {
                    html: defaultProgress,
                    css: defaultProgress,
                    javascript: defaultProgress
                }
            }
        };
    } catch (error) {
        console.error('Error loading profile data:', error);
        throw redirect(302, '/');
    }
}; 