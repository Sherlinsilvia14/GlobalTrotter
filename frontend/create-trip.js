/**
 * Create/Edit Trip Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode'); // 'edit' or null
    const tripId = urlParams.get('id');

    const form = document.getElementById('trip-form');
    const pageTitle = document.getElementById('page-title');
    const submitBtn = document.getElementById('submit-btn');

    const nameInput = document.getElementById('trip-name');
    const startInput = document.getElementById('trip-start');
    const endInput = document.getElementById('trip-end');
    const descInput = document.getElementById('trip-desc');
    const imageInput = document.getElementById('trip-image-url');
    const imagePreview = document.getElementById('image-preview');
    const placeholderText = document.querySelector('.placeholder-text');

    // 1. Initialize for Edit Mode or Create Mode
    if (mode === 'edit' && tripId) {
        pageTitle.textContent = 'Edit Trip Details';
        submitBtn.textContent = 'Save Changes';
        loadTripData(tripId);
    } else {
        pageTitle.textContent = 'Plan a New Journey';
        submitBtn.textContent = 'Create Trip';
    }

    // 2. Image Preview Handler
    imageInput.addEventListener('input', () => {
        const url = imageInput.value.trim();
        if (url) {
            imagePreview.src = url;
            imagePreview.style.display = 'block';
            placeholderText.style.display = 'none';
        } else {
            imagePreview.style.display = 'none';
            placeholderText.style.display = 'block';
        }
    });

    // 3. Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic Validation
        if (!nameInput.value || !startInput.value || !endInput.value) {
            alert('Please fill in all required fields.');
            return;
        }

        const newTrip = {
            id: tripId || Date.now().toString(),
            name: nameInput.value,
            startDate: startInput.value,
            endDate: endInput.value,
            description: descInput.value,
            image: imageInput.value || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'
        };

        saveTrip(newTrip);
    });

    function loadTripData(id) {
        // Attempt to load from localStorage first, then fallback to mock data (simulated)
        // In a real app we would fetch from API
        let trips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');

        // If empty locally, check if we had mock data in dashboard (Since we don't share JS state directly easily without a backend or LS init, we have to assume LS is the source of truth for edits, or this is a demo)
        // For the demo: If not in LS, we can't really edit the *Mock* data from dashboard.js unless we put mock data in LS on start.
        // Let's assume dashboard.js puts the initial Mock data into LS if empty. *Going back to fix dashboard.js logic to ensure data exists.*
        // For now, let's try to find it.

        const trip = trips.find(t => t.id === id);
        if (trip) {
            nameInput.value = trip.name;
            startInput.value = trip.startDate;
            endInput.value = trip.endDate;
            descInput.value = trip.description || '';
            imageInput.value = trip.image || '';

            // Trigger preview
            if (trip.image) {
                imageInput.dispatchEvent(new Event('input'));
            }
        }
    }

    function saveTrip(trip) {
        let trips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');

        if (mode === 'edit') {
            const index = trips.findIndex(t => t.id === trip.id);
            if (index !== -1) {
                trips[index] = trip;
            } else {
                trips.push(trip); // Fallback
            }
        } else {
            trips.unshift(trip); // Add new to top
        }

        localStorage.setItem('globetrotter_trips', JSON.stringify(trips));

        // Redirect
        window.location.href = 'dashboard.html';
    }
});
