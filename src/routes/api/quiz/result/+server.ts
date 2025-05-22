import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { quizResults, users, easyChallenges, mediumChallenges, hardChallenges, userEasyProgress, userMediumProgress, userHardProgress } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { verifyToken } from '$lib/server/auth';

export async function POST({ request, cookies }) {
    try {
        const sessionToken = cookies.get('session');
        if (!sessionToken) {
            console.log('No session token found');
            return json({ error: 'Unauthorized - No session found' }, { status: 401 });
        }

        // Verify the session token and get the user ID
        const payload = await verifyToken(sessionToken);
        if (!payload) {
            console.log('Invalid session token');
            return json({ error: 'Invalid session' }, { status: 401 });
        }

        const userId = payload.userId;
        const { quizId, timeTaken, isCorrect, difficulty } = await request.json();
        
        console.log('Quiz submission received:', { userId, quizId, timeTaken, isCorrect, difficulty });

        // Get current user points
        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        console.log('Current user points:', currentUser?.total_points);

        // Save quiz result
        const result = await db.insert(quizResults).values({
            user_id: userId,
            challenge_id: quizId,
            challenge_type: difficulty,
            completed_at: new Date().toISOString(),
            score: isCorrect ? 1 : 0,
            time_taken: timeTaken,
            is_correct: isCorrect ? 1 : 0
        }).returning().get();

        console.log('Quiz result saved:', result);

        // Update user's total points and progress if answer was correct
        if (isCorrect) {
            console.log('Correct answer - updating points and progress');
            // Get the quiz points based on difficulty
            let quiz;
            
            switch (difficulty) {
                case 'easy': {
                    quiz = await db.query.easyChallenges.findFirst({
                        where: eq(easyChallenges.id, quizId)
                    });
                    console.log('Found easy quiz:', quiz);

                    if (quiz) {
                        console.log('Points to be added:', quiz.points);
                        // Update user's total points
                        const updateResult = await db.update(users)
                            .set({ 
                                total_points: sql`${users.total_points} + ${quiz.points}`
                            })
                            .where(eq(users.id, userId))
                            .returning()
                            .get();
                        
                        // Log the updated total_points for monitoring
                        const newPoints = updateResult?.total_points;
                        console.log(`User ID ${userId} - Points updated. Added: ${quiz.points}, New total_points: ${newPoints}`);

                        // Update easy progress
                        const existingProgress = await db.query.userEasyProgress.findFirst({
                            where: eq(userEasyProgress.challenge_id, quizId)
                        });

                        console.log('Existing progress found:', existingProgress);

                        if (existingProgress) {
                            await db.update(userEasyProgress)
                                .set({
                                    completed: true,
                                    completed_at: new Date().toISOString(),
                                    attempts: sql`${userEasyProgress.attempts} + 1`,
                                    last_attempt: new Date().toISOString()
                                })
                                .where(eq(userEasyProgress.id, existingProgress.id));
                        } else {
                            await db.insert(userEasyProgress).values({
                                user_id: userId,
                                challenge_id: quizId,
                                completed: true,
                                completed_at: new Date().toISOString(),
                                attempts: 1,
                                last_attempt: new Date().toISOString()
                            });
                        }
                    }
                    break;
                }
                case 'medium': {
                    quiz = await db.query.mediumChallenges.findFirst({
                        where: eq(mediumChallenges.id, quizId)
                    });
                    console.log('Found medium quiz:', quiz);

                    if (quiz) {
                        console.log('Points to be added:', quiz.points);
                        // Update user's total points
                        const updateResult = await db.update(users)
                            .set({ 
                                total_points: sql`${users.total_points} + ${quiz.points}`
                            })
                            .where(eq(users.id, userId))
                            .returning()
                            .get();
                        
                        // Log the updated total_points for monitoring
                        const newPoints = updateResult?.total_points;
                        console.log(`User ID ${userId} - Points updated. Added: ${quiz.points}, New total_points: ${newPoints}`);

                        // Update medium progress
                        const existingProgress = await db.query.userMediumProgress.findFirst({
                            where: eq(userMediumProgress.challenge_id, quizId)
                        });

                        console.log('Existing progress found:', existingProgress);

                        if (existingProgress) {
                            await db.update(userMediumProgress)
                                .set({
                                    completed: true,
                                    completed_at: new Date().toISOString(),
                                    attempts: sql`${userMediumProgress.attempts} + 1`,
                                    last_attempt: new Date().toISOString()
                                })
                                .where(eq(userMediumProgress.id, existingProgress.id));
                        } else {
                            await db.insert(userMediumProgress).values({
                                user_id: userId,
                                challenge_id: quizId,
                                completed: true,
                                completed_at: new Date().toISOString(),
                                attempts: 1,
                                last_attempt: new Date().toISOString()
                            });
                        }
                    }
                    break;
                }
                case 'hard': {
                    quiz = await db.query.hardChallenges.findFirst({
                        where: eq(hardChallenges.id, quizId)
                    });
                    console.log('Found hard quiz:', quiz);

                    if (quiz) {
                        console.log('Points to be added:', quiz.points);
                        // Update user's total points
                        const updateResult = await db.update(users)
                            .set({ 
                                total_points: sql`${users.total_points} + ${quiz.points}`
                            })
                            .where(eq(users.id, userId))
                            .returning()
                            .get();
                        
                        // Log the updated total_points for monitoring
                        const newPoints = updateResult?.total_points;
                        console.log(`User ID ${userId} - Points updated. Added: ${quiz.points}, New total_points: ${newPoints}`);

                        // Update hard progress
                        const existingProgress = await db.query.userHardProgress.findFirst({
                            where: eq(userHardProgress.challenge_id, quizId)
                        });

                        console.log('Existing progress found:', existingProgress);

                        if (existingProgress) {
                            await db.update(userHardProgress)
                                .set({
                                    completed: true,
                                    completed_at: new Date().toISOString(),
                                    attempts: sql`${userHardProgress.attempts} + 1`,
                                    last_attempt: new Date().toISOString()
                                })
                                .where(eq(userHardProgress.id, existingProgress.id));
                        } else {
                            await db.insert(userHardProgress).values({
                                user_id: userId,
                                challenge_id: quizId,
                                completed: true,
                                completed_at: new Date().toISOString(),
                                attempts: 1,
                                last_attempt: new Date().toISOString()
                            });
                        }
                    }
                    break;
                }
            }

            // Verify points were updated
            const updatedUser = await db.query.users.findFirst({
                where: eq(users.id, userId)
            });
            console.log('Updated user points:', updatedUser?.total_points);
        }

        return json({ success: true, result });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
        }, { status: 500 });
    }
} 