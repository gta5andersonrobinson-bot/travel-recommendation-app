document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', clearResults);
    }

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        searchResults.innerHTML = ''; // Clear previous results

        if (query === '') return;

        fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                let results = [];

                // Check for keyword variations
                if (query.includes('beach')) {
                    results = data.beaches;
                } else if (query.includes('temple')) {
                    results = data.temples;
                } else if (query.includes('country') || query.includes('australia')) {
                    // Extract cities from the matching country
                    results = data.countries[0].cities; 
                }

                if (results.length > 0) {
                    displayResults(results);
                } else {
                    searchResults.innerHTML = '<p>No recommendations found for your search. Try "beaches", "temples", or "countries".</p>';
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayResults(items) {
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';

            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <button>Visit</button>
            `;
            
            searchResults.appendChild(card);
        });
    }

    function clearResults() {
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
});