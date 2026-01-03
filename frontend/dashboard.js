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
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Tokyo Adventure',
        startDate: '2024-11-10',
        endDate: '2024-11-20',
        description: 'Experiencing the neon lights of Shinjuku, historic temples of Asakusa, and the best sushi in the world.',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1988&auto=format&fit=crop'
    },
    {
        id: '3',
        name: 'New York Business',
        startDate: '2024-01-05',
        endDate: '2024-01-10',
        description: 'Attending the tech summit and meeting with potential clients in Manhattan.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop'
    }
];

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth (Simulated)
    const token = localStorage.getItem('token');

    // 2. Load Local Storage Trips if available (Merging with mock for demo)
    const storedTrips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    if (storedTrips.length > 0) {
        trips = storedTrips; // Use user defined trips if any
    }

    renderTrips();

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Log out?')) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    });
});

function renderTrips() {
    const grid = document.getElementById('trips-grid');
    const emptyState = document.getElementById('empty-state');

    grid.innerHTML = '';

    if (trips.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    trips.forEach(trip => {
        const card = document.createElement('div');
        card.className = 'trip-card';

        // Fallback image
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
                    <button class="btn-action" onclick="viewTrip('${trip.id}')">View</button>
                    <button class="btn-action" onclick="shareTrip('${trip.id}')">Share</button>
                    <button class="btn-action edit" onclick="editTrip('${trip.id}')">Edit</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Global window actions
window.viewTrip = (id) => {
    alert('Navigating to trip details for ID: ' + id);
    // window.location.href = `trip-details.html?id=${id}`;
};

window.shareTrip = (id) => {
    // Mock share
    alert(`Link copied: https://globetrotter.app/share/${id}`);
};

window.editTrip = (id) => {
    // Navigate to Create Trip page in edit mode
    window.location.href = `create-trip.html?mode=edit&id=${id}`;
};
