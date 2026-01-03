/**
 * ThisAI City View Logic with Maps & 'Mark as Done'
 */

let currentTrip = null;
let currentSpots = [];
let map = null;
let markerLayer = null;
let currentFilter = 'all'; // 'all', 'pending', 'done'

// Mock City Coordinates
const CityCoords = {
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Bali': { lat: -8.4095, lng: 115.1889 },
    'Zermatt': { lat: 46.0207, lng: 7.7491 },
    'Hinganghat': { lat: 20.4497, lng: 78.8475 },
    'Default': { lat: 20.5937, lng: 78.9629 }
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get('id');

    if (!tripId) {
        window.location.href = 'dashboard.html';
        return;
    }

    loadCityDetails(tripId);

    // Form Listener
    document.getElementById('add-spot-form').addEventListener('submit', handleAddSpot);
});

function loadCityDetails(id) {
    const trips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    currentTrip = trips.find(t => t.id === id);

    if (!currentTrip) {
        document.getElementById('loading').innerHTML = '<h2>Trip not found!</h2>';
        return;
    }

    // Render Header
    document.getElementById('city-name').textContent = currentTrip.name;
    document.getElementById('city-dates').textContent = `${formatDate(currentTrip.startDate)} - ${formatDate(currentTrip.endDate)}`;

    const bgImage = currentTrip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
    document.getElementById('city-banner').style.backgroundImage = `url('${bgImage}')`;

    // Load Spots
    const savedSpots = JSON.parse(localStorage.getItem(`globetrotter_spots_${id}`) || '[]');

    if (savedSpots.length > 0) {
        currentSpots = savedSpots;
    } else {
        currentSpots = getMockSpots(currentTrip.name);
        // Save initial mocks
        saveSpotsToLS(id, currentSpots);
    }

    // Init Map
    initMap(currentTrip.name);

    renderSpots();

    document.getElementById('loading').style.display = 'none';
    document.getElementById('city-content').style.display = 'block';

    setTimeout(() => { if (map) map.invalidateSize(); }, 200);
}

function initMap(cityName) {
    let center = CityCoords['Default'];
    for (const city in CityCoords) {
        if (cityName.includes(city)) {
            center = CityCoords[city];
            break;
        }
    }

    map = L.map('map').setView([center.lat, center.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    markerLayer = L.layerGroup().addTo(map);

    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        openAddSpotModal(lat, lng);
    });
}

function toggleDone(index) {
    // Toggle state
    currentSpots[index].isDone = !currentSpots[index].isDone;

    // Persist
    saveSpotsToLS(currentTrip.id, currentSpots);

    // Re-render
    renderSpots();
}

function filterSpots(filterType) {
    currentFilter = filterType;

    // Update Btn Styles
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    // Simple way to select active btn based on text content logic or index, 
    // but here we just grab by onclick attribute equivalent or text
    const btns = document.querySelectorAll('.filter-btn');
    if (filterType === 'all') btns[0].classList.add('active');
    if (filterType === 'pending') btns[1].classList.add('active');
    if (filterType === 'done') btns[2].classList.add('active');

    renderSpots();
}

function renderSpots() {
    const grid = document.getElementById('spots-grid');
    grid.innerHTML = '';

    if (markerLayer) markerLayer.clearLayers();

    // Filter Logic
    let displaySpots = currentSpots.map((spot, index) => ({ ...spot, originalIndex: index })); // Keep track of original index for toggling

    if (currentFilter === 'pending') {
        displaySpots = displaySpots.filter(s => !s.isDone);
    } else if (currentFilter === 'done') {
        displaySpots = displaySpots.filter(s => s.isDone);
    }

    if (displaySpots.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#888;">No spots found for this filter.</div>';
        return;
    }

    displaySpots.forEach((spot) => {
        const isDone = spot.isDone;
        const index = spot.originalIndex;

        // Render Card
        const card = document.createElement('div');
        card.className = `spot-card ${isDone ? 'done-state' : ''}`;
        card.innerHTML = `
            <div class="spot-image" style="background-image: url('${spot.image || 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=400'}');">
                <div class="card-actions">
                     <div class="action-badge done-btn" onclick="event.stopPropagation(); toggleDone(${index})" title="${isDone ? 'Mark as Pending' : 'Mark as Done'}">
                        <i class="fas fa-check"></i>
                     </div>
                </div>
                <div class="spot-icon-badge" onclick="event.stopPropagation(); zoomToSpot(${index})"><i class="fas fa-map-marker-alt"></i></div>
            </div>
            <div class="spot-body">
                <h3 class="spot-title">${spot.name}</h3>
                <p class="spot-desc">${spot.desc || 'No description provided.'}</p>
            </div>
        `;
        // Click card to zoom
        card.addEventListener('click', () => zoomToSpot(index));

        grid.appendChild(card);

        // Render Marker
        if (spot.lat && spot.lng) {
            // HTML Marker Icon
            const color = isDone ? 'green' : '#ff5555'; // Green for done, Red for pending
            const iconClass = isDone ? 'fa-check-circle' : 'fa-map-marker-alt';

            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="font-size: 2rem; color: ${color}; text-shadow: 2px 2px 2px white;"><i class="fas ${iconClass}"></i></div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
                popupAnchor: [0, -45]
            });

            const marker = L.marker([spot.lat, spot.lng], { icon: customIcon })
                .bindPopup(`<b>${spot.name}</b><br>${isDone ? '<span style="color:green">Completed</span>' : 'Pending'}`)
                .addTo(markerLayer);

            // Link marker click to highlight card could be complex, for now just popup
        }
    });
}

function zoomToSpot(index) {
    const spot = currentSpots[index];
    if (spot && spot.lat && spot.lng && map) {
        map.flyTo([spot.lat, spot.lng], 15);
    }
}

function handleAddSpot(e) {
    e.preventDefault();

    const name = document.getElementById('spot-name').value;
    const image = document.getElementById('spot-image').value;
    const desc = document.getElementById('spot-desc').value;
    const lat = parseFloat(document.getElementById('spot-lat').value);
    const lng = parseFloat(document.getElementById('spot-lng').value);

    let finalLat = lat;
    let finalLng = lng;

    if (!finalLat || !finalLng) {
        const center = map.getCenter();
        finalLat = center.lat;
        finalLng = center.lng;
    }

    const newSpot = {
        name,
        image,
        desc,
        lat: finalLat,
        lng: finalLng,
        isDone: false // Default new spots to pending
    };

    currentSpots.push(newSpot);
    saveSpotsToLS(currentTrip.id, currentSpots);
    renderSpots();
    closeAddSpotModal();
    e.target.reset();
}

function saveSpotsToLS(tripId, spots) {
    localStorage.setItem(`globetrotter_spots_${tripId}`, JSON.stringify(spots));
}

// Modal Functions
window.openAddSpotModal = (lat = null, lng = null) => {
    document.getElementById('add-spot-modal').classList.add('open');
    if (lat && lng) {
        document.getElementById('spot-lat').value = lat;
        document.getElementById('spot-lng').value = lng;
    }
};

window.closeAddSpotModal = () => {
    document.getElementById('add-spot-modal').classList.remove('open');
};

// Utils
function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getMockSpots(cityName) {
    let baseLoc = CityCoords['Default'];
    for (const city in CityCoords) {
        if (cityName.includes(city)) {
            baseLoc = CityCoords[city];
            break;
        }
    }

    return [
        {
            name: `${cityName} Landmark`,
            desc: 'A must-visit attraction.',
            image: 'https://images.unsplash.com/photo-1444723121867-fa630c68f8fd?auto=format&fit=crop&w=400',
            lat: baseLoc.lat + 0.01,
            lng: baseLoc.lng + 0.01,
            isDone: false
        },
        {
            name: 'Famous Park',
            desc: 'Green space in the city.',
            image: 'https://images.unsplash.com/photo-1497911270199-1c552ee648a3?auto=format&fit=crop&w=400',
            lat: baseLoc.lat - 0.005,
            lng: baseLoc.lng - 0.005,
            isDone: true // One completed example
        }
    ];
}
