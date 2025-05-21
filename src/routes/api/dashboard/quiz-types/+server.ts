import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { quizTypes } from '$lib/server/db/schema';

export async function GET() {
    try {
        const types = await db.select().from(quizTypes);
        return json(types);
    } catch (error) {
        console.error('Error fetching quiz types:', error);
        return json({ error: 'Failed to fetch quiz types' }, { status: 500 });
    }
} 