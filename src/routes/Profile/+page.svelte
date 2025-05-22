<script lang="ts">
    import type { PageData } from './$types';
    import Background from '../../lib/Background.svelte';
    import Header from '$lib/Header.svelte';

    export let data: PageData;
    let error = data.error || '';
    let userData = data.profile || {
        username: "",
        email: "",
        rank: "Beginner",
        progress: {
            html: { percentage: 0, completedTasks: 0, totalTasks: 50 },
            css: { percentage: 0, completedTasks: 0, totalTasks: 50 },
            javascript: { percentage: 0, completedTasks: 0, totalTasks: 50 }
        }
    };
</script>

<div class="relative min-h-screen w-full overflow-x-hidden">
    <Background />
    <Header />

    <main class="flex justify-center items-center px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        {#if error}
            <div class="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p class="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        {:else}
            <div class="bg-white/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                <!-- User Profile Section -->
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                    <div class="w-24 h-24 sm:w-32 sm:h-32">
                        <img
                            src="/dp.jpg"
                            alt="Profile Picture"
                            class="w-full h-full rounded-full object-cover border-4 border-gray-200"
                        />
                    </div>
                    <div class="text-center sm:text-left flex-grow">
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{userData.username}</h1>
                        <p class="text-gray-600 mt-1">{userData.email}</p>
                        <p class="text-purple-600 font-semibold mt-2">Rank: {userData.rank}</p>
                    </div>
                </div>

                <!-- Progress Section -->
                <div class="mt-8">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">Class Progress</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- HTML Progress -->
                        <div class="bg-gray-100 p-6 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4">HTML</h3>
                            <div class="relative pt-1">
                                <div class="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                                    <div
                                        style="width: {userData.progress.html.percentage}%"
                                        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                                    ></div>
                                </div>
                                <div class="flex justify-between mt-2">
                                    <span class="text-sm font-semibold text-gray-600">{userData.progress.html.percentage}%</span>
                                    <span class="text-sm font-medium text-gray-500">
                                        {userData.progress.html.completedTasks}/{userData.progress.html.totalTasks} Tasks
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- CSS Progress -->
                        <div class="bg-gray-100 p-6 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4">CSS</h3>
                            <div class="relative pt-1">
                                <div class="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                                    <div
                                        style="width: {userData.progress.css.percentage}%"
                                        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                                    ></div>
                                </div>
                                <div class="flex justify-between mt-2">
                                    <span class="text-sm font-semibold text-gray-600">{userData.progress.css.percentage}%</span>
                                    <span class="text-sm font-medium text-gray-500">
                                        {userData.progress.css.completedTasks}/{userData.progress.css.totalTasks} Tasks
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- JavaScript Progress -->
                        <div class="bg-gray-100 p-6 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4">JavaScript</h3>
                            <div class="relative pt-1">
                                <div class="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                                    <div
                                        style="width: {userData.progress.javascript.percentage}%"
                                        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 transition-all duration-500"
                                    ></div>
                                </div>
                                <div class="flex justify-between mt-2">
                                    <span class="text-sm font-semibold text-gray-600">{userData.progress.javascript.percentage}%</span>
                                    <span class="text-sm font-medium text-gray-500">
                                        {userData.progress.javascript.completedTasks}/{userData.progress.javascript.totalTasks} Tasks
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>