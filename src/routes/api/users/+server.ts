import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, generateToken, validateEmail, validatePassword } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { email, password, username, isLogin } = await request.json();

        if (!email || !password) {
            return json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (!validateEmail(email)) {
            return json({ error: 'Invalid email format' }, { status: 400 });
        }

        if (!isLogin && !validatePassword(password)) {
            return json({ 
                error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' 
            }, { status: 400 });
        }

        if (isLogin) {
            // Login logic
            const user = await db.query.users.findFirst({
                where: eq(users.email, email)
            });

            if (!user || !(await verifyPassword(password, user.password_hash))) {
                return json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const token = await generateToken(user.id);
            
            // Set HTTP-only cookie
            cookies.set('session', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 24 hours
            });

            return json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    total_points: user.total_points,
                    rank: user.rank
                }
            });
        } else {
            // Registration logic
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email)
            });

            if (existingUser) {
                return json({ error: 'Email already registered' }, { status: 400 });
            }

            const hashedPassword = await hashPassword(password);
            
            const [newUser] = await db.insert(users).values({
                email,
                password_hash: hashedPassword,
                username: username || email.split('@')[0], // Use provided username or default from email
                total_points: 0,
                rank: 'Beginner'
            }).returning();

            const token = await generateToken(newUser.id);
            
            // Set HTTP-only cookie
            cookies.set('session', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 24 hours
            });

            return json({
                message: 'Registration successful',
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username,
                    total_points: newUser.total_points,
                    rank: newUser.rank
                }
            }, { status: 201 });
        }
    } catch (error) {
        console.error('Auth error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};