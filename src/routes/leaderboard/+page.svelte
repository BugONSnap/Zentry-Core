<script lang="ts">
    import Background from '../../lib/Background.svelte';
    import Header from '$lib/Header.svelte';

    // Dummy data for the leaderboard
    // TODO: Replace with actual database fetching logic
    let leaderboardData = [
      { name: "John Doe", xp: 2500, ranking: 1 },
      { name: "Jane Smith", xp: 2350, ranking: 2 },
      { name: "Mike Johnson", xp: 2200, ranking: 3 },
      { name: "Sarah Wilson", xp: 2100, ranking: 4 },
      { name: "Tom Brown", xp: 2000, ranking: 5 },
      { name: "Emily Davis", xp: 1950, ranking: 6 },
      { name: "David Lee", xp: 1900, ranking: 7 },
      { name: "Lisa Anderson", xp: 1850, ranking: 8 },
      { name: "Alex Turner", xp: 1800, ranking: 9 },
      { name: "Maria Garcia", xp: 1750, ranking: 10 },
      { name: "Chris Martin", xp: 1700, ranking: 11 },
      { name: "Emma White", xp: 1650, ranking: 12 },
      { name: "Ryan Cooper", xp: 1600, ranking: 13 },
      { name: "Sophie Chen", xp: 1550, ranking: 14 },
      { name: "Kevin Park", xp: 1500, ranking: 15 },
      { name: "Rachel Kim", xp: 1450, ranking: 16 },
      { name: "Daniel Brown", xp: 1400, ranking: 17 },
      { name: "Amanda Lee", xp: 1350, ranking: 18 },
      { name: "James Wilson", xp: 1300, ranking: 19 },
      { name: "Linda Martinez", xp: 1250, ranking: 20 },
      { name: "Michael Scott", xp: 1200, ranking: 21 },
      { name: "Olivia Taylor", xp: 1150, ranking: 22 },
      { name: "William Jones", xp: 1100, ranking: 23 },
      { name: "Isabella Moore", xp: 1050, ranking: 24 }
    ];
  
    const itemsPerPage = 8;
    let currentPage = 1;
    let totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  
    $: displayedData = leaderboardData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    function prevPage() {
      if (currentPage > 1) currentPage--;
    }
  
    function nextPage() {
      if (currentPage < totalPages) currentPage++;
    }
</script>

<div class="relative min-h-screen w-full overflow-x-hidden">
    <Background />
    <Header />
    
    <main class="flex justify-center items-center px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div class="bg-white/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 lg:mb-8 text-gray-800">Leader Board</h1>
            
            <!-- Mobile view: Card layout -->
            <div class="block sm:hidden space-y-4">
                {#each displayedData as { name, xp, ranking }}
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <div class="flex justify-between items-center">
                            <div class="space-y-1">
                                <p class="font-semibold text-gray-700">Name: <span class="text-gray-600">{name}</span></p>
                                <p class="font-semibold text-gray-700">XP: <span class="text-gray-600">{xp}</span></p>
                                <p class="font-semibold text-gray-700">Rank: <span class="text-gray-600">#{ranking}</span></p>
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
                        {#each displayedData as { name, xp, ranking }}
                            <tr class="border-t border-gray-200">
                                <td class="p-3 lg:p-4 text-gray-600">{name}</td>
                                <td class="p-3 lg:p-4 text-gray-600">{xp}</td>
                                <td class="p-3 lg:p-4 text-gray-600">{ranking}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <div class="flex items-center justify-center gap-4 mt-6">
                <button 
                    class="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    on:click={prevPage} 
                    disabled={currentPage === 1}
                >&lt;&lt;</button>
                <span class="px-4 py-2 bg-white rounded-lg border border-gray-200">
                    {currentPage} of {totalPages}
                </span>
                <button 
                    class="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    on:click={nextPage} 
                    disabled={currentPage === totalPages}
                >&gt;&gt;</button>
            </div>
        </div>
    </main>
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
</style>