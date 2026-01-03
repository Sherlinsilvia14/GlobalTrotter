document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Data
    const cityData = getCityData();
    const params = new URLSearchParams(window.location.search);
    const cityId = params.get('cityId') || 'paris';

    // Update Back Link
    document.getElementById('back-link').href = `city-overview.html?cityId=${cityId}`;
    document.getElementById('page-title').textContent = `Tourist Places in ${cityData.name}`;

    // 2. Map Initialization
    const map = L.map('map-places').setView([cityData.coordinates.lat, cityData.coordinates.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markers = {}; // Store markers by ID

    // 3. Render Places and Markers
    const grid = document.getElementById('places-grid');

    cityData.places.forEach(place => {
        // --- A. Create Card HTML ---
        const card = document.createElement('div');
        card.className = `place-card ${place.done ? 'is-done' : ''}`;
        card.id = `card-${place.id}`;

        card.innerHTML = `
            <img src="${place.image}" alt="${place.name}" class="place-img" loading="lazy">
            <div class="place-content">
                <div class="place-header">
                    <h3 class="place-title">${place.name}</h3>
                    <i class="fas fa-check-circle status-icon ${place.done ? 'done' : ''}" 
                       title="Mark as Done" 
                       onclick="toggleDone(event, ${place.id})"></i>
                </div>
                <div class="place-meta" style="margin-bottom: 0.5rem;">
                    <i class="fas fa-map-marker-alt" style="margin-right: 0.5rem;"></i>
                    View on Map
                </div>
                <p class="place-desc">${place.description}</p>
            </div>
        `;

        // Card Interaction
        card.addEventListener('mouseenter', () => highlightMarker(place.id));
        card.addEventListener('mouseleave', () => resetMarker(place.id));
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('status-icon')) {
                zoomToMarker(place.id);
            }
        });

        grid.appendChild(card);

        // --- B. Create Map Marker ---
        const marker = L.marker([place.lat, place.lng], {
            icon: getIcon(place.done)
        }).addTo(map);

        marker.bindPopup(`<b>${place.name}</b>`);

        // Marker Interaction
        marker.on('click', () => {
            scrollToCard(place.id);
            highlightCard(place.id);
        });

        markers[place.id] = marker;
    });

    // --- Helpers ---

    window.toggleDone = function (event, id) {
        event.stopPropagation(); // Prevent card click
        const card = document.getElementById(`card-${id}`);
        const icon = card.querySelector('.status-icon');
        const marker = markers[id];

        // Toggle classes
        const isDone = card.classList.toggle('is-done');
        icon.classList.toggle('done');

        // Update Marker Icon
        marker.setIcon(getIcon(isDone));
    };

    function getIcon(isDone) {
        // Simple color diff or use custom icon
        // Using Leaflet default for active, and a filtered version logic if complex, 
        // but here let's swap colors effectively by using different marker hues if possible 
        // or just standard vs custom. 
        // For simplicity: Default Blue = Pending, Green (Hue shift) = Done

        // Since we don't have custom assets readily, we can use a trick or standard markers.
        // Let's use a filter on the marker element via CSS class if we could, but changing icon object is better.
        // We will stick to standard blue for now, but maybe add a popup text change?
        // Actually, let's try to grab a green marker image URL if available, or just keep it simple.
        // Better: Use a custom divIcon with FontAwesome!

        const color = isDone ? '#10B981' : '#3B82F6'; // Green or Blue

        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:${color};width:30px;height:30px;border-radius:50%;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;">
                    <i class="fas ${isDone ? 'fa-check' : 'fa-map-marker-alt'}"></i>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
    }

    function highlightMarker(id) {
        const marker = markers[id];
        if (marker) {
            marker.openPopup();
        }
    }

    function resetMarker(id) {
        const marker = markers[id];
        if (marker) {
            marker.closePopup();
        }
    }

    function zoomToMarker(id) {
        const marker = markers[id];
        if (marker) {
            map.flyTo(marker.getLatLng(), 15);
            marker.openPopup();
        }
    }

    function scrollToCard(id) {
        const card = document.getElementById(`card-${id}`);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function highlightCard(id) {
        const card = document.getElementById(`card-${id}`);
        // Remove active class from all
        document.querySelectorAll('.place-card').forEach(c => c.classList.remove('active-marker'));
        card.classList.add('active-marker');
        setTimeout(() => card.classList.remove('active-marker'), 2000);
    }

    // --- Add Spot Modal Logic ---
    const modal = document.getElementById('add-spot-modal');
    const openBtn = document.getElementById('add-spot-btn');
    const closeBtn = document.getElementById('close-add-spot');
    const cancelBtn = document.getElementById('cancel-add-spot');
    const form = document.getElementById('add-spot-form');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    function closeModal() {
        modal.style.display = 'none';
        form.reset();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('spot-name').value;
            const desc = document.getElementById('spot-desc').value;
            const image = document.getElementById('spot-image').value || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'; // Default travel image

            // Create New Place Object
            const newId = cityData.places.length + 100; // Simple ID generation
            const newPlace = {
                id: newId,
                name: name,
                lat: cityData.coordinates.lat + (Math.random() - 0.5) * 0.05, // Random offset near city center
                lng: cityData.coordinates.lng + (Math.random() - 0.5) * 0.05,
                description: desc,
                image: image,
                done: false
            };

            // Add to Data (Local Session)
            cityData.places.push(newPlace);

            // Render Card
            const card = document.createElement('div');
            card.className = `place-card`;
            card.id = `card-${newPlace.id}`;
            card.innerHTML = `
                <img src="${newPlace.image}" alt="${newPlace.name}" class="place-img" loading="lazy">
                <div class="place-content">
                    <div class="place-header">
                        <h3 class="place-title">${newPlace.name}</h3>
                        <i class="fas fa-check-circle status-icon" 
                           title="Mark as Done" 
                           onclick="toggleDone(event, ${newPlace.id})"></i>
                    </div>
                    <div class="place-meta" style="margin-bottom: 0.5rem;">
                        <i class="fas fa-map-marker-alt" style="margin-right: 0.5rem;"></i>
                        View on Map
                    </div>
                    <p class="place-desc">${newPlace.description}</p>
                </div>
            `;

            // Interaction Helpers (Re-attach listeners)
            card.addEventListener('mouseenter', () => highlightMarker(newPlace.id));
            card.addEventListener('mouseleave', () => resetMarker(newPlace.id));
            card.addEventListener('click', (ev) => {
                if (!ev.target.classList.contains('status-icon')) {
                    zoomToMarker(newPlace.id);
                }
            });

            grid.appendChild(card);

            // Render Marker
            const marker = L.marker([newPlace.lat, newPlace.lng], {
                icon: getIcon(false)
            }).addTo(map);
            marker.bindPopup(`<b>${newPlace.name}</b>`);
            marker.on('click', () => {
                scrollToCard(newPlace.id);
                highlightCard(newPlace.id);
            });
            markers[newPlace.id] = marker;

            // Close and Scroll
            closeModal();
            card.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Link Check (Auto Open Modal) ---
    if (params.get('action') === 'add') {
        if (modal) modal.style.display = 'flex';
    }

});
