import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const quizTypes = sqliteTable('quiz_types', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description')
});

// Insert default quiz types
const defaultQuizTypes = [
	{ name: 'Time Trial Quiz', description: 'Complete the quiz within a time limit' },
	{ name: 'Spell Type Quiz', description: 'Test your spelling skills' },
	{ name: 'Identification Quiz', description: 'Identify the correct answer' },
	{ name: 'Multiple Choice Quiz', description: 'Select the correct answer from options' }
];

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username').notNull(),
	email: text('email').notNull(),
	password_hash: text('password_hash').notNull(),
	created_at: text('created_at'),
	total_points: integer('total_points').default(0),
	rank: text('rank')
});

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

export const badges = sqliteTable('badges', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	description: text('description').notNull(),
	required_points: integer('required_points').notNull(),
	icon_url: text('icon_url')
});

export const userBadges = sqliteTable('user_badges', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	badge_id: integer('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	earned_at: text('earned_at').default(sql`CURRENT_TIMESTAMP`)
});

export const easyChallenges = sqliteTable('easy_challenges', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	category_id: integer('category_id').notNull().references(() => categories.id),
	quiz_type_id: integer('quiz_type_id').notNull().references(() => quizTypes.id),
	title: text('title').notNull(),
	description: text('description').notNull(),
	points: integer('points').default(10),
	answer: text('answer').notNull(),
	explanation: text('explanation'),
	difficulty: text('difficulty').default('easy'),
	time_limit: integer('time_limit'), // in seconds, for time trial quizzes
	options: text('options') // JSON string for multiple choice options
});

export const mediumChallenges = sqliteTable('medium_challenges', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	category_id: integer('category_id').notNull().references(() => categories.id),
	quiz_type_id: integer('quiz_type_id').notNull().references(() => quizTypes.id),
	title: text('title').notNull(),
	description: text('description').notNull(),
	points: integer('points').default(20),
	answer: text('answer').notNull(),
	explanation: text('explanation'),
	difficulty: text('difficulty').default('medium'),
	time_limit: integer('time_limit'),
	options: text('options')
});

export const hardChallenges = sqliteTable('hard_challenges', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	category_id: integer('category_id').notNull().references(() => categories.id),
	quiz_type_id: integer('quiz_type_id').notNull().references(() => quizTypes.id),
	title: text('title').notNull(),
	description: text('description').notNull(),
	points: integer('points').default(30),
	answer: text('answer').notNull(),
	explanation: text('explanation'),
	difficulty: text('difficulty').default('hard'),
	time_limit: integer('time_limit'),
	options: text('options')
});

export const userEasyProgress = sqliteTable('user_easy_progress', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: integer('user_id').notNull().references(() => users.id),
	challenge_id: integer('challenge_id').notNull().references(() => easyChallenges.id),
	completed: integer('completed', { mode: 'boolean' }).default(sql`0`),
	completed_at: text('completed_at'),
	attempts: integer('attempts').default(0),
	last_attempt: text('last_attempt')
});

export const userMediumProgress = sqliteTable('user_medium_progress', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: integer('user_id').notNull().references(() => users.id),
	challenge_id: integer('challenge_id').notNull().references(() => mediumChallenges.id),
	completed: integer('completed', { mode: 'boolean' }).default(sql`0`),
	completed_at: text('completed_at'),
	attempts: integer('attempts').default(0),
	last_attempt: text('last_attempt')
});

export const userHardProgress = sqliteTable('user_hard_progress', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: integer('user_id').notNull().references(() => users.id),
	challenge_id: integer('challenge_id').notNull().references(() => hardChallenges.id),
	completed: integer('completed', { mode: 'boolean' }).default(sql`0`),
	completed_at: text('completed_at'),
	attempts: integer('attempts').default(0),
	last_attempt: text('last_attempt')
});

export const quizResults = sqliteTable('quiz_results', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: integer('user_id').notNull().references(() => users.id),
	challenge_id: integer('challenge_id').notNull(), // ID from the challenge table
	challenge_type: text('challenge_type').notNull(), // 'easy', 'medium', or 'hard'
	completed_at: text('completed_at').notNull(),
	score: integer('score').notNull(),
	time_taken: integer('time_taken'),
	is_correct: integer('is_correct').notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	easyProgress: many(userEasyProgress),
	mediumProgress: many(userMediumProgress),
	hardProgress: many(userHardProgress),
	badges: many(userBadges)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	easyChallenges: many(easyChallenges),
	mediumChallenges: many(mediumChallenges),
	hardChallenges: many(hardChallenges)
}));

export const quizTypesRelations = relations(quizTypes, ({ many }) => ({
	easyChallenges: many(easyChallenges),
	mediumChallenges: many(mediumChallenges),
	hardChallenges: many(hardChallenges)
}));

export const badgesRelations = relations(badges, ({ many }) => ({
	userBadges: many(userBadges)
}));

export const easyChallengesRelations = relations(easyChallenges, ({ one }) => ({
	category: one(categories, {
		fields: [easyChallenges.category_id],
		references: [categories.id]
	}),
	quizType: one(quizTypes, {
		fields: [easyChallenges.quiz_type_id],
		references: [quizTypes.id]
	})
}));

export const mediumChallengesRelations = relations(mediumChallenges, ({ one }) => ({
	category: one(categories, {
		fields: [mediumChallenges.category_id],
		references: [categories.id]
	}),
	quizType: one(quizTypes, {
		fields: [mediumChallenges.quiz_type_id],
		references: [quizTypes.id]
	})
}));

export const hardChallengesRelations = relations(hardChallenges, ({ one }) => ({
	category: one(categories, {
		fields: [hardChallenges.category_id],
		references: [categories.id]
	}),
	quizType: one(quizTypes, {
		fields: [hardChallenges.quiz_type_id],
		references: [quizTypes.id]
	})
}));
