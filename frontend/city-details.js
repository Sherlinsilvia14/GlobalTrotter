/**
 * ThisAI City Details Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get('id');

    if (!tripId) {
        alert('No trip specified!');
        window.location.href = 'dashboard.html';
        return;
    }

    loadCityDetails(tripId);
});

function loadCityDetails(id) {
    // 1. Get Trips from LS
    const trips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    const trip = trips.find(t => t.id === id);

    if (!trip) {
        document.getElementById('loading').innerHTML = '<h2>Trip not found!</h2><a href="dashboard.html">Go Back</a>';
        return;
    }

    // 2. Render Hero
    document.getElementById('city-name').textContent = trip.name;
    document.getElementById('city-dates').textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;
    document.getElementById('city-desc').textContent = trip.description || 'No description available for this trip.';

    // Set banner image (Logic: Use trip image, or default)
    const bgImage = trip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
    document.getElementById('city-banner').style.backgroundImage = `url('${bgImage}')`;

    // 3. Render Spots (Mock Data for now, could be stored in trip object later)
    renderSpots(trip);

    // Show Content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('city-content').style.display = 'block';
}

function renderSpots(trip) {
    const grid = document.getElementById('spots-grid');

    // Mock spots based on City Name keywords to make it look dynamic
    let spots = getMockSpots(trip.name);

    if (spots.length === 0) {
        grid.innerHTML = '<p>No spots added yet.</p>';
        return;
    }

    grid.innerHTML = spots.map(spot => `
        <div class="spot-card">
            <div class="spot-image" style="background-image: url('${spot.image}')"></div>
            <div class="spot-body">
                <h3 class="spot-title">${spot.name}</h3>
                <p class="spot-desc">${spot.desc}</p>
            </div>
        </div>
    `).join('');
}

function getMockSpots(cityName) {
    const lowerName = cityName.toLowerCase();

    if (lowerName.includes('paris') || lowerName.includes('france')) {
        return [
            { name: 'Eiffel Tower', desc: 'The iron lady of Paris.', image: 'https://images.unsplash.com/photo-1511739001486-6eb42f6b4f9c?auto=format&fit=crop&w=400' },
            { name: 'Louvre Museum', desc: 'Home of the Mona Lisa.', image: 'https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&w=400' },
            { name: 'Montmartre', desc: 'Artistic district with great views.', image: 'https://images.unsplash.com/photo-1580227546747-062e245a192c?auto=format&fit=crop&w=400' }
        ];
    }

    if (lowerName.includes('tokyo') || lowerName.includes('japan')) {
        return [
            { name: 'Senso-ji Temple', desc: 'Ancient Buddhist temple.', image: 'https://images.unsplash.com/photo-1583049103986-7a1953259838?auto=format&fit=crop&w=400' },
            { name: 'Shibuya Crossing', desc: 'Busiest intersection in the world.', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400' },
            { name: 'Akihabara', desc: 'Electric town.', image: 'https://images.unsplash.com/photo-1620803626248-18e923e0ec58?auto=format&fit=crop&w=400' }
        ];
    }

    // Default Generic Spots
    return [
        { name: 'City Center', desc: 'The heart of the city.', image: 'https://images.unsplash.com/photo-1444723121867-fa630c68f8fd?auto=format&fit=crop&w=400' },
        { name: 'Famous Park', desc: 'A great place to relax.', image: 'https://images.unsplash.com/photo-1497911270199-1c552ee648a3?auto=format&fit=crop&w=400' },
        { name: 'Local Market', desc: 'Best local food and souvenirs.', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=400' }
    ];
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
