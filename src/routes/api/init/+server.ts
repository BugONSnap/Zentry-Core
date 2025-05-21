import { json } from '@sveltejs/kit';
import { initializeDatabase } from '$lib/server/db/migrations/init';

export async function POST() {
    try {
        await initializeDatabase();
        return json({ success: true, message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Error initializing database:', error);
        return json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to initialize database' 
        }, { status: 500 });
    }
} 