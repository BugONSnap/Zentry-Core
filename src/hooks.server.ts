import { verifyToken } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get('session');

    if (!session) {
        // If accessing a protected route without a session, redirect to login
        if (event.url.pathname.startsWith('/dashboard') || 
            event.url.pathname.startsWith('/profile') || 
            event.url.pathname.startsWith('/leaderboard')) {
            return Response.redirect(new URL('/', event.url.origin));
        }
        return await resolve(event);
    }

    const payload = await verifyToken(session);
    
    if (!payload) {
        // Invalid token, clear the cookie and redirect to login
        event.cookies.delete('session', { path: '/' });
        if (event.url.pathname.startsWith('/dashboard') || 
            event.url.pathname.startsWith('/profile') || 
            event.url.pathname.startsWith('/leaderboard')) {
            return Response.redirect(new URL('/', event.url.origin));
        }
        return await resolve(event);
    }

    // Add user to event.locals for use in routes
    event.locals.user = { id: payload.userId };

    return await resolve(event);
}; 