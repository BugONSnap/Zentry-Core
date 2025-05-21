import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';

export async function GET() {
    try {
        const cats = await db.select().from(categories);
        return json(cats);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
} 