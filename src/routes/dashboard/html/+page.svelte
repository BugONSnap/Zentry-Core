<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/header.svelte';
    import Background from '$lib/Background.svelte';
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';
    import { browser } from '$app/environment';

    export let data: PageData;

    interface Quiz {
        id: number;
        title: string;
        description: string;
        points: number;
        answer: string;
        explanation: string;
        quiz_type_id: number;
        category_id: number;
        time_limit?: number;
        options?: string[];
    }

    interface QuizForm {
        title: string;
        description: string;
        answer: string;
        explanation: string;
        points: number;
        difficulty: 'easy' | 'medium' | 'hard';
        quiz_type_id: number;
        category_id: number;
        time_limit: number;
        options: string[];
    }

    // Add state for quiz creation form
    let showQuizForm = false;
    let quizTypes: { id: number; name: string; description: string }[] = [
        { id: 1, name: 'Time Trial Quiz', description: 'Complete the quiz within a time limit' },
        { id: 2, name: 'Spell Type Quiz', description: 'Test your spelling skills' },
        { id: 3, name: 'Identification Quiz', description: 'Identify the correct answer' },
        { id: 4, name: 'Multiple Choice Quiz', description: 'Select the correct answer from options' }
    ];

    let categories: { id: number; name: string }[] = [
        { id: 1, name: 'HTML Basics' },
        { id: 2, name: 'CSS Fundamentals' },
        { id: 3, name: 'JavaScript Core' },
        { id: 4, name: 'Web Development' }
    ];

    let quizzes: {
        easy: Quiz[];
        medium: Quiz[];
        hard: Quiz[];
    } = {
        easy: [],
        medium: [],
        hard: []
    };

    let quizForm: QuizForm = {
        title: '',
        description: '',
        answer: '',
        explanation: '',
        points: 10,
        difficulty: 'easy',
        quiz_type_id: 1,
        category_id: 1,
        time_limit: 0,
        options: []
    };

    let isAdmin = false;

    onMount(() => {
        if (browser) {
            isAdmin = localStorage.getItem('isAdmin') === 'true';
            if (!isAdmin) {
                showQuizForm = false; // Ensure quiz form is closed for non-admins
            }
        }
    });

    function toggleQuizForm() {
        showQuizForm = !showQuizForm;
        console.log('Toggle quiz form:', showQuizForm); // Debug log
    }

    onMount(async () => {
        try {
            // Fetch quizzes
            const quizzesResponse = await fetch('/api/dashboard/quizzes');
            const quizzesData = await quizzesResponse.json();
            quizzes = quizzesData;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    function addOption() {
        quizForm.options = [...quizForm.options, ''];
    }

    function removeOption(index: number) {
        quizForm.options = quizForm.options.filter((_, i) => i !== index);
    }

    function updateOption(index: number, event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            quizForm.options = quizForm.options.map((opt, i) => i === index ? target.value : opt);
        }
    }

    async function handleQuizSubmit() {
        try {
            // Validate form
            if (quizForm.quiz_type_id === 4 && quizForm.options.length < 2) {
                alert('Multiple choice quizzes must have at least 2 options');
                return;
            }

            if (quizForm.quiz_type_id === 1 && (!quizForm.time_limit || quizForm.time_limit < 1)) {
                alert('Time trial quizzes must have a valid time limit');
                return;
            }

            // For multiple choice, validate that the answer matches one of the options
            if (quizForm.quiz_type_id === 4 && !quizForm.options.includes(quizForm.answer)) {
                alert('The answer must match one of the multiple choice options exactly');
                return;
            }

            // Create a copy of the form data
            const formData = {
                ...quizForm,
                // Convert options array to string for multiple choice quizzes
                options: quizForm.quiz_type_id === 4 ? JSON.stringify(quizForm.options) : null,
                // Ensure points are appropriate for difficulty
                points: quizForm.points || (
                    quizForm.difficulty === 'easy' ? 10 :
                    quizForm.difficulty === 'medium' ? 20 : 30
                )
            };

            const response = await fetch('/api/dashboard/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                successMessage.textContent = 'Quiz created successfully!';
                document.body.appendChild(successMessage);
                setTimeout(() => successMessage.remove(), 3000);

                // Refresh quizzes
                const quizzesResponse = await fetch('/api/dashboard/quizzes');
                const quizzesData = await quizzesResponse.json();
                quizzes = quizzesData;
                
                // Reset form
                quizForm = {
                    title: '',
                    description: '',
                    answer: '',
                    explanation: '',
                    points: quizForm.difficulty === 'easy' ? 10 : 
                            quizForm.difficulty === 'medium' ? 20 : 30,
                    difficulty: 'easy',
                    quiz_type_id: 1,
                    category_id: 1,
                    time_limit: 0,
                    options: []
                };
                showQuizForm = false;
            } else {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                errorMessage.textContent = 'Error: ' + (data.error || 'Failed to create quiz');
                document.body.appendChild(errorMessage);
                setTimeout(() => errorMessage.remove(), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            errorMessage.textContent = 'Failed to create quiz. Please try again.';
            document.body.appendChild(errorMessage);
            setTimeout(() => errorMessage.remove(), 3000);
        }
    }

    function handleQuizClick(quiz: Quiz) {
        // Handle quiz selection/navigation
        console.log('Selected quiz:', quiz);
    }
</script>

<div class="relative min-h-screen w-full overflow-x-hidden">
    <Background />
    <Header />

    <main class="min-h-screen pt-20 px-4 relative z-10">
        <div class="max-w-7xl mx-auto space-y-16">
            <!-- Add Quiz Creation Button - Only visible to admin -->
            {#if isAdmin}
                <div class="flex justify-end mb-8">
                    <button
                        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
                        on:click={toggleQuizForm}
                    >
                        {showQuizForm ? 'Close Form' : 'Create New Quiz'}
                    </button>
                </div>
            {/if}

            <!-- Quiz Creation Form -->
            {#if showQuizForm}
                <div class="absolute top-24 right-4 z-50">
                    <div class="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl w-[600px] p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Create New Quiz</h2>
                            <button
                                class="text-gray-500 hover:text-gray-700"
                                on:click={toggleQuizForm}
                            >
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form on:submit|preventDefault={handleQuizSubmit} class="space-y-4">
                            <div class="space-y-4">
                                <div class="space-y-2">
                                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        bind:value={quizForm.title}
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    />
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            id="category"
                                            bind:value={quizForm.category_id}
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        >
                                            {#each categories as category}
                                                <option value={category.id}>{category.name}</option>
                                            {/each}
                                        </select>
                                    </div>

                                    <div class="space-y-2">
                                        <label for="quiz_type" class="block text-sm font-medium text-gray-700">Quiz Type</label>
                                        <select
                                            id="quiz_type"
                                            bind:value={quizForm.quiz_type_id}
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        >
                                            {#each quizTypes as quizType}
                                                <option value={quizType.id}>{quizType.name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <label for="difficulty" class="block text-sm font-medium text-gray-700">Difficulty</label>
                                        <select
                                            id="difficulty"
                                            bind:value={quizForm.difficulty}
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>

                                    <div class="space-y-2">
                                        <label for="points" class="block text-sm font-medium text-gray-700">Points</label>
                                        <input
                                            type="number"
                                            id="points"
                                            bind:value={quizForm.points}
                                            min="1"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="description"
                                        bind:value={quizForm.description}
                                        rows="4"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    ></textarea>
                                </div>

                                <div class="space-y-2">
                                    <label for="answer" class="block text-sm font-medium text-gray-700">Answer</label>
                                    <input
                                        type="text"
                                        id="answer"
                                        bind:value={quizForm.answer}
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label for="explanation" class="block text-sm font-medium text-gray-700">Explanation</label>
                                    <textarea
                                        id="explanation"
                                        bind:value={quizForm.explanation}
                                        rows="3"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    ></textarea>
                                </div>

                                <!-- Add time limit field for Time Trial quizzes -->
                                {#if quizForm.quiz_type_id === 1}
                                    <div class="space-y-2">
                                        <label for="time_limit" class="block text-sm font-medium text-gray-700">Time Limit (seconds)</label>
                                        <input
                                            type="number"
                                            id="time_limit"
                                            bind:value={quizForm.time_limit}
                                            min="1"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                {/if}

                                <!-- Replace the old options input with this new multiple choice interface -->
                                {#if quizForm.quiz_type_id === 4}
                                    <div class="space-y-4">
                                        <div class="flex justify-between items-center">
                                            <label class="block text-sm font-medium text-gray-700">Multiple Choice Options</label>
                                            <button
                                                type="button"
                                                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                on:click={addOption}
                                            >
                                                Add Option
                                            </button>
                                        </div>
                                        
                                        {#if quizForm.options.length === 0}
                                            <p class="text-sm text-gray-500 italic">Add at least two options for your multiple choice quiz.</p>
                                        {/if}

                                        {#each quizForm.options as option, index}
                                            <div class="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter option {index + 1}"
                                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                                    value={option}
                                                    on:input={(e) => updateOption(index, e)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    on:click={() => removeOption(index)}
                                                >
                                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        {/each}

                                        {#if quizForm.options.length > 0}
                                            <p class="text-sm text-gray-500">
                                                Make sure one of the options matches exactly with your answer.
                                            </p>
                                        {/if}
                                    </div>
                                {/if}
                            </div>

                            <div class="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                                    on:click={toggleQuizForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Create Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            {/if}

            <!-- Quiz Display Areas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Beginner Area -->
                <section class="area-container">
                    <h2 class="text-2xl font-bold mb-6 text-black">Beginner Area</h2>
                    <div class="grid gap-4">
                        {#each quizzes.easy as quiz (quiz.id)}
                            <div 
                                class="quiz-card bg-white/80 p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                                on:click={() => handleQuizClick(quiz)}
                            >
                                <h3 class="font-bold text-lg text-gray-800">{quiz.title}</h3>
                                <p class="text-sm text-gray-600 mt-1">Points: {quiz.points}</p>
                        </div>
                    {/each}
                </div>
            </section>

            <!-- Medium Area -->
            <section class="area-container">
                    <h2 class="text-2xl font-bold mb-6 text-black">Medium Area</h2>
                    <div class="grid gap-4">
                        {#each quizzes.medium as quiz (quiz.id)}
                            <div 
                                class="quiz-card bg-white/80 p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                                on:click={() => handleQuizClick(quiz)}
                            >
                                <h3 class="font-bold text-lg text-gray-800">{quiz.title}</h3>
                                <p class="text-sm text-gray-600 mt-1">Points: {quiz.points}</p>
                        </div>
                    {/each}
                </div>
            </section>

            <!-- Hard Area -->
            <section class="area-container">
                    <h2 class="text-2xl font-bold mb-6 text-black">Hard Area</h2>
                    <div class="grid gap-4">
                        {#each quizzes.hard as quiz (quiz.id)}
                            <div 
                                class="quiz-card bg-white/80 p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                                on:click={() => handleQuizClick(quiz)}
                            >
                                <h3 class="font-bold text-lg text-gray-800">{quiz.title}</h3>
                                <p class="text-sm text-gray-600 mt-1">Points: {quiz.points}</p>
                        </div>
                    {/each}
                </div>
            </section>
            </div>
        </div>
    </main>
</div>

<style>
    .area-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
        padding: 2rem;
        border-radius: 1rem;
        transition: transform 0.3s ease;
    }

    .area-container:hover {
        transform: translateY(-5px);
    }

    .quiz-card {
        transition: all 0.2s ease;
    }

    .quiz-card:hover {
        transform: translateY(-2px);
    }
</style>