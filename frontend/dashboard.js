/**
 * GlobeTrotter Dashboard Logic
 */

// Mock Data
let trips = [
    {
        id: '1',
        name: 'Summer in Paris',
        startDate: '2024-06-15',
        endDate: '2024-06-22',
        description: 'A week-long exploration of art, culture, and cuisine in the heart of France. Visiting the Louvre, Eiffel Tower, and more.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
        budget: 2500,
        cities: 1
    },
    {
        id: '2',
        name: 'Tokyo Adventure',
        startDate: '2024-11-10',
        endDate: '2024-11-20',
        description: 'Experiencing the neon lights of Shinjuku, historic temples of Asakusa, and the best sushi in the world.',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1988&auto=format&fit=crop',
        budget: 3500,
        cities: 3
    },
    {
        id: '3',
        name: 'New York Business',
        startDate: '2024-01-05',
        endDate: '2024-01-10',
        description: 'Attending the tech summit and meeting with potential clients in Manhattan.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
        budget: 1800,
        cities: 1
    },
    {
        id: '4',
        name: 'Bali Retreat',
        startDate: '2025-03-10',
        endDate: '2025-03-20',
        description: 'Yoga and meditation retreat in Ubud.',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop',
        budget: 1500,
        cities: 1
    },
    {
        id: '5',
        name: 'Swiss Alps Skiing',
        startDate: '2027-01-15',
        endDate: '2027-01-22',
        description: 'Skiing in Zermatt with amazing views of the Matterhorn.',
        image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=2000&auto=format&fit=crop',
        budget: 4500,
        cities: 2
    }
];

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Calculate duration in days
const getDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Inclusive
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth
    const token = localStorage.getItem('token');

    // 2. Load Trips
    const storedTrips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    if (storedTrips.length > 0) {
        // Merge stored trips with mock trips, avoiding duplicates if logic was more complex
        // For simple demo, let's just use stored trips if they exist, or seed them if not.
        trips = storedTrips;
    } else {
        // Seed initial data to LS so 'Edit' works effectively across reloads
        localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
    }

    // 3. Init Dashboard
    initDashboard();

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Log out?')) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    });
});

function initDashboard() {
    renderTrips(); // Initial render
    updateStats(); // Initial stats (Global)

    // Year Selector Listener for Grid Only
    const yearSelector = document.getElementById('year-selector');
    if (yearSelector) {
        yearSelector.addEventListener('change', () => {
            renderTrips();
        });
    }
}

function updateStats() {
    // Global Stats (All Years)
    const now = new Date();

    // Categorize
    const completedTrips = trips.filter(t => new Date(t.endDate) < now).length;
    const upcomingTrips = trips.filter(t => new Date(t.endDate) >= now).length;

    const totalDays = trips.reduce((acc, trip) => {
        return acc + getDuration(trip.startDate, trip.endDate);
    }, 0);

    const totalBudget = trips.reduce((acc, trip) => {
        const budget = trip.budget || 2000;
        return acc + parseInt(budget);
    }, 0);

    // Update DOM
    const elUpcoming = document.getElementById('stat-upcoming');
    const elCompleted = document.getElementById('stat-completed');
    const elDays = document.getElementById('stat-days');
    const elBudget = document.getElementById('stat-budget');

    if (elUpcoming) elUpcoming.textContent = upcomingTrips;
    if (elCompleted) elCompleted.textContent = completedTrips;
    if (elDays) elDays.textContent = totalDays;
    if (elBudget) elBudget.textContent = `$${totalBudget.toLocaleString()}`;
}

function renderTrips() {
    const grid = document.getElementById('trips-grid');
    const emptyState = document.getElementById('empty-state');
    const yearSelector = document.getElementById('year-selector');

    grid.innerHTML = '';

    // Filter by Year if selector exists
    let filteredTrips = [...trips];
    if (yearSelector && yearSelector.value !== 'all') {
        const selectedYear = parseInt(yearSelector.value, 10);
        filteredTrips = filteredTrips.filter(trip => {
            const tripYear = new Date(trip.startDate).getFullYear();
            return tripYear === selectedYear;
        });
    }

    // Sort trips by date descending
    filteredTrips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    if (filteredTrips.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    filteredTrips.forEach(trip => {
        const card = document.createElement('div');
        card.className = 'trip-card';

        const bgImage = trip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';

        card.innerHTML = `
            <div class="card-image-container" style="background-image: url('${bgImage}');">
                <div class="card-overlay">
                    <h3 class="trip-name">${trip.name}</h3>
                    <div class="trip-date">${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}</div>
                </div>
            </div>
            <div class="card-body">
                <p class="trip-description">${trip.description || 'No description provided.'}</p>
                <div class="card-actions">
                    <button class="btn-action view" onclick="viewTrip('${trip.id}')">View</button>
                    <button class="btn-action share" onclick="shareTrip('${trip.id}')">Share</button>
                    <button class="btn-action edit" onclick="editTrip('${trip.id}')">Edit</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Global actions
window.viewTrip = (id) => {
    alert('Navigating to trip details for ID: ' + id);
};

window.shareTrip = (id) => {
    alert(`Link copied: https://globetrotter.app/share/${id}`);
};

window.editTrip = (id) => {
    window.location.href = `create-trip.html?mode=edit&id=${id}`;
};
