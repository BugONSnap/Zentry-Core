import { jwtVerify, SignJWT } from 'jose';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import bcrypt from 'bcryptjs';

if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not set');

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function generateToken(userId: number): Promise<string> {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
    
    return token;
}

export async function verifyToken(token: string): Promise<{ userId: number } | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { userId: number };
    } catch (error) {
        return null;
    }
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
} 