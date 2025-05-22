<script lang="ts">
    import type { PageData } from './$types';
    import Background from '../../lib/Background.svelte';
    import Header from '$lib/Header.svelte';

    let { data }: { data: PageData } = $props();

    // Use the real leaderboard data from the API
    let players = $derived(data.leaderboard);
</script>

<div class="relative min-h-screen w-full overflow-x-hidden">
    <!-- Background Component -->
    <Background />

    <Header />
    <!-- Leaderboard Table -->
    <main class="flex justify-center items-center px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div class="bg-white/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 lg:mb-8 text-gray-800">Top Players</h1>
            
            <!-- Mobile view: Card layout -->
            <div class="block sm:hidden space-y-4">
                {#each players as player}
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <div class="flex justify-between items-center">
                            <div class="space-y-1">
                                <p class="font-semibold text-gray-700">Name: <span class="text-gray-600">{player.name}</span></p>
                                <p class="font-semibold text-gray-700">XP: <span class="text-gray-600">{player.xp}</span></p>
                                <p class="font-semibold text-gray-700">Rank: <span class="text-gray-600">#{player.ranking}</span></p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Tablet and Desktop view: Table layout -->
            <div class="hidden sm:block">
                <table class="w-full text-left bg-gray-100 rounded-lg overflow-hidden">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="p-3 lg:p-4 text-base lg:text-lg font-semibold text-gray-700">Name</th>
                            <th class="p-3 lg:p-4 text-base lg:text-lg font-semibold text-gray-700">XP</th>
                            <th class="p-3 lg:p-4 text-base lg:text-lg font-semibold text-gray-700">Ranking</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each players as player}
                            <tr class="border-t border-gray-200">
                                <td class="p-3 lg:p-4 text-gray-600">{player.name}</td>
                                <td class="p-3 lg:p-4 text-gray-600">{player.xp}</td>
                                <td class="p-3 lg:p-4 text-gray-600">{player.ranking}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- Tech Icons -->
    <div class="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 lg:gap-16 mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6 lg:px-8">
        <a href="/dashboard/html" class="text-center hover:scale-105 transition-transform duration-200 group">
            <div class="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <img src="/HTMK.png" alt="HTML5" class="tech-icon" />
                <p class="mt-2 text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">HTML</p>
            </div>
        </a>
        <a href="/dashboard/css" class="text-center hover:scale-105 transition-transform duration-200 group">
            <div class="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <img src="/CSS.png" alt="CSS3" class="tech-icon" />
                <p class="mt-2 text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">CSS</p>
            </div>
        </a>
        <a href="/dashboard/js" class="text-center hover:scale-105 transition-transform duration-200 group">
            <div class="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <img src="/JS.webp" alt="JavaScript" class="tech-icon" />
                <p class="mt-2 text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">JavaScript</p>
            </div>
        </a>
    </div>
</div>

<style>
    table {
        border-collapse: separate;
        border-spacing: 0;
    }
    th:first-child {
        border-top-left-radius: 0.5rem;
    }
    th:last-child {
        border-top-right-radius: 0.5rem;
    }
    tr:last-child td:first-child {
        border-bottom-left-radius: 0.5rem;
    }
    tr:last-child td:last-child {
        border-bottom-right-radius: 0.5rem;
    }
    .tech-icon {
        width: 120px;
        height: 120px;
        object-fit: contain;
    }
    @media (min-width: 640px) {
        .tech-icon {
            width: 150px;
            height: 150px;
        }
    }
    @media (min-width: 1024px) {
        .tech-icon {
            width: 180px;
            height: 180px;
        }
    }
</style>