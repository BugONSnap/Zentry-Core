<script lang="ts">
    import type { PageData } from './$types';
    import Background from '../../lib/Background.svelte';
    import Header from '../../lib/header.svelte';

    let { data }: { data: PageData } = $props();

    // Enhanced dummy user data with more detailed progress information
    let userData = {
        username: "Username",
        email: "user@example.com",
        progress: {
            css: {
                percentage: 65,
                level: 3,
                currentDifficulty: "Intermediate",
                completedTasks: 24,
                totalTasks: 40,
                lastCompleted: "CSS Grid Layout"
            },
            html: {
                percentage: 80,
                level: 4,
                currentDifficulty: "Advanced",
                completedTasks: 32,
                totalTasks: 45,
                lastCompleted: "Semantic HTML"
            },
            javascript: {
                percentage: 45,
                level: 2,
                currentDifficulty: "Beginner",
                completedTasks: 15,
                totalTasks: 50,
                lastCompleted: "Basic Functions"
            }
        }
    };
</script>

<div class="relative min-h-screen w-full overflow-x-hidden">
    <!-- Background Component -->
    <Background />

    <Header />

    <!-- Main Content -->
    <main class="flex justify-center items-center px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
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
                <div class="text-center sm:text-left">
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{userData.username}</h1>
                    <p class="text-gray-600 mt-1">{userData.email}</p>
                </div>
                <div class="sm:ml-auto">
                    <button class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>

            <!-- Progress Section -->
            <div class="mt-8">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">PROGRESS</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- CSS Progress -->
                    <div class="bg-gray-100 p-6 rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-800">CSS PROGRESS</h3>
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                Level {userData.progress.css.level}
                            </span>
                        </div>
                        <div class="relative pt-1">
                            <div class="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                                <div
                                    style="width: {userData.progress.css.percentage}%"
                                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                                >
                                </div>
                            </div>
                            <div class="flex justify-between mt-2">
                                <span class="text-sm font-semibold text-gray-600">{userData.progress.css.percentage}%</span>
                                <span class="text-sm font-medium text-gray-500">{userData.progress.css.completedTasks}/{userData.progress.css.totalTasks} Tasks</span>
                            </div>
                        </div>
                        <div class="mt-4 space-y-2">
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Current Difficulty:</span> 
                                <span class="text-blue-600">{userData.progress.css.currentDifficulty}</span>
                            </p>
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Last Completed:</span> 
                                <span class="text-blue-600">{userData.progress.css.lastCompleted}</span>
                            </p>
                        </div>
                    </div>

                    <!-- HTML Progress -->
                    <div class="bg-gray-100 p-6 rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-800">HTML PROGRESS</h3>
                            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Level {userData.progress.html.level}
                            </span>
                        </div>
                        <div class="relative pt-1">
                            <div class="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                                <div
                                    style="width: {userData.progress.html.percentage}%"
                                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                                >
                                </div>
                            </div>
                            <div class="flex justify-between mt-2">
                                <span class="text-sm font-semibold text-gray-600">{userData.progress.html.percentage}%</span>
                                <span class="text-sm font-medium text-gray-500">{userData.progress.html.completedTasks}/{userData.progress.html.totalTasks} Tasks</span>
                            </div>
                        </div>
                        <div class="mt-4 space-y-2">
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Current Difficulty:</span> 
                                <span class="text-green-600">{userData.progress.html.currentDifficulty}</span>
                            </p>
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Last Completed:</span> 
                                <span class="text-green-600">{userData.progress.html.lastCompleted}</span>
                            </p>
                        </div>
                    </div>

                    <!-- JavaScript Progress -->
                    <div class="bg-gray-100 p-6 rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-800">JS PROGRESS</h3>
                            <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                Level {userData.progress.javascript.level}
                            </span>
                        </div>
                        <div class="relative pt-1">
                            <div class="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                                <div
                                    style="width: {userData.progress.javascript.percentage}%"
                                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 transition-all duration-500"
                                >
                                </div>
                            </div>
                            <div class="flex justify-between mt-2">
                                <span class="text-sm font-semibold text-gray-600">{userData.progress.javascript.percentage}%</span>
                                <span class="text-sm font-medium text-gray-500">{userData.progress.javascript.completedTasks}/{userData.progress.javascript.totalTasks} Tasks</span>
                            </div>
                        </div>
                        <div class="mt-4 space-y-2">
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Current Difficulty:</span> 
                                <span class="text-yellow-600">{userData.progress.javascript.currentDifficulty}</span>
                            </p>
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Last Completed:</span> 
                                <span class="text-yellow-600">{userData.progress.javascript.lastCompleted}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    /* Add any additional custom styles here */
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>