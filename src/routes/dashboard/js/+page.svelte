<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/Header.svelte';
    import Background from '$lib/Background.svelte';

    let { data }: { data: PageData } = $props();

    // Define types for our level structure
    interface Level {
        id: number;
        title: string;
        difficulty: 'beginner' | 'medium' | 'hard';
        isUnlocked: boolean;
    }

    // Reactive data for levels
    let levels: Level[] = [
        // Beginner Levels
        { id: 1, title: 'JS Basics', difficulty: 'beginner', isUnlocked: true },
        { id: 2, title: 'Variables', difficulty: 'beginner', isUnlocked: false },
        // Medium Levels
        { id: 3, title: 'Functions', difficulty: 'medium', isUnlocked: false },
        { id: 4, title: 'DOM', difficulty: 'medium', isUnlocked: false },
        // Hard Levels
        { id: 5, title: 'Async JS', difficulty: 'hard', isUnlocked: false },
        { id: 6, title: 'Advanced JS', difficulty: 'hard', isUnlocked: false },
    ];

    // Filter levels by difficulty using derived values
    const beginnerLevels = $derived(levels.filter(level => level.difficulty === 'beginner'));
    const mediumLevels = $derived(levels.filter(level => level.difficulty === 'medium'));
    const hardLevels = $derived(levels.filter(level => level.difficulty === 'hard'));

    // Handle level click
    function handleLevelClick(level: Level) {
        if (level.isUnlocked) {
            // Navigate to quiz page with level parameters
            window.location.href = `/dashboard/quiz?id=${level.id}&category=js`;
        } else {
            // Show locked message or requirement
            console.log(`Level ${level.id} is locked`);
        }
    }
</script>

<div class="relative min-h-screen w-full overflow-x-hidden">
    <Background />
    <Header />

    <main class="min-h-screen pt-20 px-4 relative z-10">
        <div class="max-w-7xl mx-auto space-y-16">
            <!-- Beginner Area -->
            <section class="area-container pt-1">
                <h1 class="text-3xl font-bold mb-8 text-black">Beginner Area</h1>
                <div class="flex gap-12">
                    {#each beginnerLevels as level (level.id)}
                        <div 
                            class="book-card" 
                            on:click={() => handleLevelClick(level)}
                            class:locked={!level.isUnlocked}
                        >
                            <div class="book-cover">
                                <img src="/Module cover.png" alt="Level {level.id} Book Cover" class="w-full h-full object-cover" />
                                <div class="book-title">
                                    <h2 class="text-xl font-bold text-white">{level.title}</h2>
                                    {#if !level.isUnlocked}
                                        <span class="lock-icon">🔒</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>

            <!-- Medium Area -->
            <section class="area-container">
                <h1 class="text-3xl font-bold mb-8 text-black">Medium Area</h1>
                <div class="flex gap-12">
                    {#each mediumLevels as level (level.id)}
                        <div 
                            class="book-card" 
                            on:click={() => handleLevelClick(level)}
                            class:locked={!level.isUnlocked}
                        >
                            <div class="book-cover">
                                <img src="/Module cover.png" alt="Level {level.id} Book Cover" class="w-full h-full object-cover" />
                                <div class="book-title">
                                    <h2 class="text-xl font-bold text-white">{level.title}</h2>
                                    {#if !level.isUnlocked}
                                        <span class="lock-icon">🔒</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>

            <!-- Hard Area -->
            <section class="area-container">
                <h1 class="text-3xl font-bold mb-8 text-black">Hard Area</h1>
                <div class="flex gap-12">
                    {#each hardLevels as level (level.id)}
                        <div 
                            class="book-card" 
                            on:click={() => handleLevelClick(level)}
                            class:locked={!level.isUnlocked}
                        >
                            <div class="book-cover">
                                <img src="/Module cover.png" alt="Level {level.id} Book Cover" class="w-full h-full object-cover" />
                                <div class="book-title">
                                    <h2 class="text-xl font-bold text-white">{level.title}</h2>
                                    {#if !level.isUnlocked}
                                        <span class="lock-icon">🔒</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        </div>
    </main>
</div>

<style>
    .area-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
        padding: 3rem;
        border-radius: 1rem;
        transition: transform 0.3s ease;
        margin-bottom: 2rem;
    }

    .area-container:hover {
        transform: translateY(-5px);
    }

    .book-card {
        width: 150px;
        height: 200px;
        perspective: 1000px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
    }

    .book-card:hover {
        transform: scale(1.05);
    }

    .book-card.locked {
        filter: grayscale(0.5);
        opacity: 0.8;
    }

    .book-card.locked:hover {
        transform: scale(1.02);
    }

    .book-cover {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        background: #2a2a2a;
    }

    .book-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .book-title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 100%;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.6);
    }

    .lock-icon {
        display: block;
        font-size: 1.2rem;
        margin-top: 0.5rem;
    }

    .book-cover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 4px solid rgba(255, 255, 255, 0.1);
        pointer-events: none;
    }
</style>
