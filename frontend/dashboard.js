/**
 * ThisAI Dashboard Logic
 */

// Mock Data
let trips = [
    {
        id: '1',
        name: 'Summer in Paris',
        startDate: '2024-06-15',
        endDate: '2024-06-22',
        description: 'A week-long exploration of art, culture, and cuisine in the heart of France.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
        budget: 2500,
        cities: 1
    },
    {
        id: '2',
        name: 'Tokyo Adventure',
        startDate: '2024-11-10',
        endDate: '2024-11-20',
        description: 'Experiencing the neon lights of Shinjuku and historic temples of Asakusa.',
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

const getDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Inclusive
};

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    loadDashboard();
});

// Carousel Logic
function initCarousel() {
    const images = [
        "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg", // Eiffel Tower
        "https://upload.wikimedia.org/wikipedia/commons/0/05/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg", // NYC
        "https://upload.wikimedia.org/wikipedia/commons/f/f0/Sensoji_2019-04-03_%281%29.jpg", // Tokyo Senso-ji
        "https://upload.wikimedia.org/wikipedia/commons/6/66/Louvre_Museum_Wikimedia_Commons.jpg", // Louvre
        "https://upload.wikimedia.org/wikipedia/commons/a/a1/Statue_of_Liberty_7.jpg" // Statue of Liberty
    ];

    const container = document.getElementById('bg-carousel');

    // Preload and create slides
    images.forEach((url, index) => {
        const slide = document.createElement('div');
        slide.className = `bg-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url('${url}')`;
        container.appendChild(slide);
    });

    // Rotate slides
    let currentSlide = 0;
    setInterval(() => {
        const slides = document.querySelectorAll('.bg-slide');
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000); // Change every 5 seconds
}

function loadDashboard() {
    // 1. Check Auth (Simple Check)
    const token = localStorage.getItem('token');
    // if (!token) window.location.href = 'login.html'; // Copied from original logic

    // 2. Load Trips
    const storedTrips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    if (storedTrips.length > 0) {
        trips = storedTrips;
    } else {
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

    // Close Modal Listener
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    window.onclick = function (event) {
        if (event.target == document.getElementById('share-modal')) {
            closeModal();
        }
    }
}

function initDashboard() {
    renderTrips();
    updateStats();

    const yearSelector = document.getElementById('year-selector');
    if (yearSelector) {
        yearSelector.addEventListener('change', () => {
            renderTrips();
        });
    }
}

function updateStats() {
    const now = new Date();
    const completedTrips = trips.filter(t => new Date(t.endDate) < now).length;
    const upcomingTrips = trips.filter(t => new Date(t.endDate) >= now).length;
    const totalDays = trips.reduce((acc, trip) => acc + getDuration(trip.startDate, trip.endDate), 0);
    const totalBudget = trips.reduce((acc, trip) => acc + parseInt(trip.budget || 0), 0);

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

    let filteredTrips = [...trips];
    if (yearSelector && yearSelector.value !== 'all') {
        const selectedYear = parseInt(yearSelector.value, 10);
        filteredTrips = filteredTrips.filter(trip => {
            const tripYear = new Date(trip.startDate).getFullYear();
            return tripYear === selectedYear;
        });
    }

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
                    <button class="btn-action view" onclick="viewTrip('${trip.id}')"><i class="far fa-eye"></i> View</button>
                    <button class="btn-action share" onclick="openShareModal('${trip.id}', '${trip.name}')"><i class="fas fa-share-alt"></i> Share</button>
                    <button class="btn-action edit" onclick="editTrip('${trip.id}')"><i class="far fa-edit"></i> Edit</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Actions
window.viewTrip = (id) => {
    const trip = trips.find(t => t.id === id);
    let cityId = 'paris'; // Default
    if (trip) {
        const name = trip.name.toLowerCase();
        if (name.includes('paris')) cityId = 'paris';
        else if (name.includes('tokyo')) cityId = 'tokyo';
        else if (name.includes('new york')) cityId = 'new-york';
        // Add more mappings if needed
    }
    window.location.href = `city-overview.html?cityId=${cityId}`;
};

window.editTrip = (id) => {
    window.location.href = `create-trip.html?mode=edit&id=${id}`;
};

// Share Modal Logic
let currentShareTripId = null;

window.openShareModal = (id, name) => {
    currentShareTripId = id;
    document.getElementById('share-trip-name').textContent = name;
    document.getElementById('share-modal').classList.add('open');
    document.getElementById('share-feedback').textContent = '';
};

window.closeModal = () => {
    document.getElementById('share-modal').classList.remove('open');
};

window.shareAction = (platform) => {
    let feedback = document.getElementById('share-feedback');
    if (platform === 'copy') {
        const url = `https://thisai.app/trips/${currentShareTripId}`;
        navigator.clipboard.writeText(url).then(() => {
            feedback.textContent = 'Link copied to clipboard!';
            setTimeout(closeModal, 1500);
        });
    } else {
        feedback.textContent = `Shared to ${platform} (Simulated)`;
        setTimeout(closeModal, 1500);
    }
};
