import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { easyChallenges, mediumChallenges, hardChallenges } from './schema';

// Create SQLite database connection
const sqlite = new Database('zentry.db');
const db = drizzle(sqlite);

const quizzes = {
  easy_challenges: [
    {
      category_id: 1,
      quiz_type_id: 1,
      title: "What is HTML?",
      description: "What does HTML stand for in web development?",
      points: 10,
      answer: "HyperText Markup Language",
      explanation: "HTML stands for HyperText Markup Language, which is the standard language used to create and structure content on web pages using tags and attributes.",
      difficulty: "easy",
      time_limit: 30,
      options: JSON.stringify([
        "HyperText Markup Language",
        "HighText Machine Language",
        "HyperTool Multi Language",
        "HomeText Markup Language"
      ])
    },
    {
      category_id: 1,
      quiz_type_id: 1,
      title: "Correct HTML Tag",
      description: "Which tag is used to create a hyperlink in HTML?",
      points: 10,
      answer: "<a>",
      explanation: "The <a> tag, with the 'href' attribute, is used to create hyperlinks in HTML, allowing navigation to other pages or resources.",
      difficulty: "easy",
      time_limit: 30,
      options: JSON.stringify([
        "<link>",
        "<a>",
        "<href>",
        "<url>"
      ])
    }
  ],
  medium_challenges: [
    {
      category_id: 1,
      quiz_type_id: 1,
      title: "Semantic HTML",
      description: "Which HTML element is used to define the main content of a document?",
      points: 20,
      answer: "<main>",
      explanation: "The <main> element is a semantic HTML5 tag that specifies the primary content of a document, excluding headers, footers, or sidebars. It improves accessibility and SEO.",
      difficulty: "medium",
      time_limit: 45,
      options: JSON.stringify([
        "<section>",
        "<article>",
        "<main>",
        "<div>"
      ])
    },
    {
      category_id: 1,
      quiz_type_id: 1,
      title: "HTML Attributes",
      description: "Which attribute is used to provide alternative text for an image in HTML?",
      points: 20,
      answer: "alt",
      explanation: "The 'alt' attribute in the <img> tag provides alternative text for images, used by screen readers for accessibility and displayed if the image fails to load.",
      difficulty: "medium",
      time_limit: 45,
      options: JSON.stringify([
        "title",
        "src",
        "alt",
        "caption"
      ])
    }
  ],
  hard_challenges: [
    {
      category_id: 1,
      quiz_type_id: 1,
      title: "HTML5 Data Attributes",
      description: "How do you correctly define a custom data attribute in HTML5?",
      points: 30,
      answer: "data-*",
      explanation: "In HTML5, custom data attributes are defined using the 'data-' prefix followed by a custom name (e.g., data-user-id). This allows storing extra information on elements without breaking standards.",
      difficulty: "hard",
      time_limit: 60,
      options: JSON.stringify([
        "custom-*",
        "data-*",
        "attr-*",
        "info-*"
      ])
    },
    {
      category_id: 1,
      quiz_type_id: 1,
      title: "Form Validation",
      description: "Which HTML5 attribute ensures a form input is required before submission?",
      points: 30,
      answer: "required",
      explanation: "The 'required' attribute, when added to an input element, prevents form submission unless the field is filled, providing client-side validation in HTML5.",
      difficulty: "hard",
      time_limit: 60,
      options: JSON.stringify([
        "mandatory",
        "required",
        "validate",
        "check"
      ])
    }
  ]
};

export async function seedQuizzes() {
  try {
    // Insert easy challenges
    for (const quiz of quizzes.easy_challenges) {
      await db.insert(easyChallenges).values(quiz);
    }

    // Insert medium challenges
    for (const quiz of quizzes.medium_challenges) {
      await db.insert(mediumChallenges).values(quiz);
    }

    // Insert hard challenges
    for (const quiz of quizzes.hard_challenges) {
      await db.insert(hardChallenges).values(quiz);
    }

    console.log('Successfully seeded all quizzes!');
  } catch (error) {
    console.error('Error seeding quizzes:', error);
  } finally {
    sqlite.close();
  }
}

// Run the seed function if this file is run directly
if (import.meta.main) {
  seedQuizzes();
} 