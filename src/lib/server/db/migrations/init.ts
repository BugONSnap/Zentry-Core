import { db } from '../index';
import { quizTypes, categories } from '../schema';

export async function initializeDatabase() {
    try {
        // Insert default quiz types
        const defaultQuizTypes = [
            { name: 'Time Trial Quiz', description: 'Complete the quiz within a time limit' },
            { name: 'Spell Type Quiz', description: 'Test your spelling skills' },
            { name: 'Identification Quiz', description: 'Identify the correct answer' },
            { name: 'Multiple Choice Quiz', description: 'Select the correct answer from options' }
        ];

        for (const quizType of defaultQuizTypes) {
            await db.insert(quizTypes).values(quizType).onConflictDoNothing();
        }

        // Insert default categories
        const defaultCategories = [
            { name: 'HTML Basics' },
            { name: 'CSS Fundamentals' },
            { name: 'JavaScript Core' },
            { name: 'Web Development' }
        ];

        for (const category of defaultCategories) {
            await db.insert(categories).values(category).onConflictDoNothing();
        }

        console.log('Database initialized with default values');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
} 