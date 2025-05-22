<script lang="ts">
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Header from '$lib/Header.svelte';
    import Background from '$lib/Background.svelte';
    import { onMount } from 'svelte';

    export let data: PageData;
    let userAnswer = '';
    let submitted = false;
    let isCorrect = false;
    let error: string | null = null;
    let timeLeft: number = data.quiz.time_limit ?? 0;
    let timerInterval: ReturnType<typeof setInterval>;
    let showTimeUpModal = false;
    let attemptCount = 0;
    let currentHint = '';

    // Split explanation into progressive hints
    const hints = data.quiz.explanation.split('. ')
        .filter(hint => hint.trim().length > 0)
        .map(hint => hint.trim() + (hint.endsWith('.') ? '' : '.'));

    onMount(() => {
        if (data.quiz.time_limit) {
            startTimer();
        }
    });

    function getNextHint() {
        if (attemptCount <= hints.length) {
            currentHint = hints.slice(0, attemptCount).join(' ');
        }
    }

    function startTimer() {
        timeLeft = data.quiz.time_limit ?? 0;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                clearInterval(timerInterval);
                if (!submitted) {
                    handleTimeUp();
                }
            }
        }, 1000);
    }

    function handleTimeUp() {
        submitted = true;
        isCorrect = false;
        error = "Time's up!";
        showTimeUpModal = true;
    }

    function resetQuiz() {
        userAnswer = '';
        submitted = false;
        error = null;
        showTimeUpModal = false;
        attemptCount = 0;
        currentHint = '';
        if (data.quiz.time_limit) {
            startTimer();
        }
    }

    function goToDashboard() {
        const category = $page.url.searchParams.get('category');
        goto(`/dashboard/${category}`);
    }

    async function handleSubmit() {
        if (!userAnswer) {
            error = 'Please provide an answer';
            return;
        }

        isCorrect = userAnswer.toLowerCase() === data.quiz.answer.toLowerCase();
        submitted = true;

        if (isCorrect) {
            clearInterval(timerInterval);
            setTimeout(() => {
                const category = $page.url.searchParams.get('category');
                goto(`/dashboard/${category}`);
            }, 2000);
        } else {
            attemptCount++;
            getNextHint();
            // Auto-reset after 3 seconds when answer is wrong
            setTimeout(() => {
                submitted = false;
                userAnswer = '';
            }, 3000);
        }
    }

    // Cleanup timer on component destruction
    onMount(() => {
        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    });
</script>

<div class="relative min-h-screen w-full overflow-x-hidden">
    <Background />
    <Header />

    <main class="min-h-screen pt-20 px-4 relative z-10">
        <div class="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-8">
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-bold text-white">{data.quiz.title}</h1>
                    {#if timeLeft > 0}
                        <div class="text-2xl font-bold text-white">
                            Time: {timeLeft}s
                        </div>
                    {/if}
                </div>

                <div class="bg-white/5 p-6 rounded-lg">
                    <!-- Question Section -->
                    <div class="mb-8">
                        <h2 class="text-xl font-semibold text-white mb-2">Question:</h2>
                        <p class="text-lg text-white mb-4">{data.quiz.description}</p>
                        
                        <!-- Help Text -->
                        <div class="bg-white/5 rounded-lg p-4 mb-4">
                            <p class="text-sm text-white/80 italic">
                                Tip: {currentHint || "Need help? Try answering first - you'll get hints after each attempt!"}
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap items-center gap-4 mb-6">
                        <span class="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                            Points: {data.quiz.points}
                        </span>
                        <span class="px-3 py-1 bg-purple-500 text-white rounded-full text-sm">
                            {data.quiz.difficulty}
                        </span>
                        {#if attemptCount > 0}
                            <span class="px-3 py-1 bg-orange-500 text-white rounded-full text-sm">
                                Attempts: {attemptCount}
                            </span>
                        {/if}
                    </div>

                    {#if error && !showTimeUpModal}
                        <div class="mb-6">
                            <div class="p-4 rounded-lg bg-red-500/20">
                                <p class="text-lg font-semibold text-white">{error}</p>
                            </div>
                        </div>
                    {/if}

                    {#if submitted && !showTimeUpModal}
                        <div class="mb-6">
                            <div class={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                <p class="text-lg font-semibold text-white">
                                    {isCorrect ? 'Correct! 🎉' : 'Incorrect. Try again!'}
                                </p>
                            </div>
                        </div>
                    {/if}

                    <div class="space-y-4">
                        <input 
                            type="text" 
                            class="w-full p-3 bg-white/10 rounded-lg text-white placeholder-white/50"
                            placeholder="Enter your answer..."
                            bind:value={userAnswer}
                            disabled={submitted}
                            on:keydown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
                        />

                        {#if !submitted}
                            <button 
                                class="w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors"
                                on:click={handleSubmit}
                            >
                                Submit Answer
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Time's Up Modal -->
    {#if showTimeUpModal}
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md w-full mx-4 transform scale-100 transition-transform">
                <h2 class="text-2xl font-bold text-white mb-4">Time's Up!</h2>
                <p class="text-white mb-6">Would you like to try again or return to the dashboard?</p>
                <div class="flex gap-4">
                    <button 
                        class="flex-1 p-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors"
                        on:click={resetQuiz}
                    >
                        Try Again
                    </button>
                    <button 
                        class="flex-1 p-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-semibold transition-colors"
                        on:click={goToDashboard}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    input {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    input:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.4);
    }
</style>