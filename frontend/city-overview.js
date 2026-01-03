document.addEventListener('DOMContentLoaded', () => {
    // 1. Get City Data
    const cityData = getCityData(); // from places-data.js

    if (!cityData) {
        alert("City not found!");
        window.location.href = 'dashboard.html';
        return;
    }

    // 2. Update UI Content
    document.getElementById('city-name').textContent = cityData.name;
    document.getElementById('city-country').textContent = cityData.country;
    document.getElementById('city-desc').textContent = cityData.description;
    document.getElementById('banner').style.backgroundImage = `url('${cityData.image}')`;

    // Update Link
    const params = new URLSearchParams(window.location.search);
    const cityId = params.get('cityId') || 'paris';
    document.getElementById('btn-tourist-places').href = `tourist-places.html?cityId=${cityId}`;

    // 3. Initialize Map
    const map = L.map('map-overview').setView([cityData.coordinates.lat, cityData.coordinates.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker for City Center
    L.marker([cityData.coordinates.lat, cityData.coordinates.lng])
        .addTo(map)
        .bindPopup(`<b>${cityData.name}</b><br>City Center`)
        .openPopup();

    // Optional: Add small circle markers for places to show distribution (but not detailed yet as per flow)
    cityData.places.forEach(place => {
        L.circleMarker([place.lat, place.lng], {
            radius: 5,
            fillColor: "#3B82F6",
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
    });
});
