<script lang="ts">
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    async function handleLogout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // Redirect to login page
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to logout. Please try again.');
        }
    }
</script>

<!-- Header -->
<header class="bg-[#d9d9d96b] backdrop-blur-sm fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Logo/Brand -->
            <div class="flex-shrink-0">
                <a href="/dashboard" class="text-xl font-bold text-gray-800">Zentry</a>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-4">
                <nav class="flex space-x-4">
                    <a href="/dashboard" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors">Home</a>
                    <a href="/leaderboard" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors">Leaderboard</a>
                    <a href="#" on:click|preventDefault={handleLogout} class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors">Logout</a>
                </nav>
                <!-- User Avatar - Desktop -->
                <div class="ml-4">
                    <a href="/profile" class="block hover:opacity-80 transition-opacity">
                        <img src="/dp.jpg" alt="User Avatar" class="w-10 h-10 rounded-full border-2 border-white" />
                    </a>
                </div>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden flex items-center">
                <button
                    on:click={toggleMenu}
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                    aria-expanded="false"
                >
                    <span class="sr-only">Open main menu</span>
                    <!-- Hamburger icon -->
                    <svg
                        class="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {#if isMenuOpen}
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        {:else}
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        {/if}
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    {#if isMenuOpen}
        <div class="md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-sm">
                <a href="/dashboard" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</a>
                <a href="/leaderboard" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Leaderboard</a>
                <a href="#" on:click|preventDefault={handleLogout} class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Logout</a>
                <div class="flex items-center px-3 py-2">
                    <a href="/profile" class="flex items-center hover:opacity-80 transition-opacity">
                        <img src="https://via.placeholder.com/40" alt="User Avatar" class="w-10 h-10 rounded-full border-2 border-white" />
                        <span class="ml-3 text-base font-medium text-gray-700">User</span>
                    </a>
                </div>
            </div>
        </div>
    {/if}
</header>

<!-- Add padding to the main content to account for fixed header -->
<div class="h-16"></div>

<style>
    /* Add smooth transitions */
    .transition-colors {
        transition: background-color 0.2s ease-in-out;
    }
</style>
