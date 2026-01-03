const MOCK_DATA = {
    // Check if we can get ID from URL, otherwise default to Paris
    "paris": {
        name: "Paris",
        country: "France",
        coordinates: { lat: 48.8566, lng: 2.3522 },
        description: "The City of Light draws millions of visitors every year with its unforgettable ambiance.",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
        places: [
            {
                id: 1,
                name: "Eiffel Tower",
                lat: 48.8584,
                lng: 2.2945,
                description: "Gustave Eiffel's iconic, wrought-iron 1889 tower.",
                image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
                done: false
            },
            {
                id: 2,
                name: "Louvre Museum",
                lat: 48.8606,
                lng: 2.3376,
                description: "World's largest art museum and historic monument.",
                image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Louvre_Museum_Wikimedia_Commons.jpg",
                done: true
            },
            {
                id: 3,
                name: "Notre-Dame Cathedral",
                lat: 48.8529,
                lng: 2.3500,
                description: "Medieval Catholic cathedral on the Île de la Cité.",
                image: "https://upload.wikimedia.org/wikipedia/commons/a/af/Notre-Dame_de_Paris_2013-07-24.jpg",
                done: false
            },
            {
                id: 4,
                name: "Arc de Triomphe",
                lat: 48.8738,
                lng: 2.2950,
                description: "Iconic triumphal arch honoring those who fought for France.",
                image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Arc_Triomphe.jpg",
                done: false
            }
        ]
    },
    "new-york": {
        name: "New York City",
        country: "USA",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        description: "The city that never sleeps, famous for its skyline and energy.",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/05/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg",
        places: [
            {
                id: 1,
                name: "Central Park",
                lat: 40.785091,
                lng: -73.968285,
                description: "Urban park in Manhattan, New York City.",
                image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815352927290%29.jpg",
                done: false
            },
            {
                id: 2,
                name: "Statue of Liberty",
                lat: 40.689247,
                lng: -74.044502,
                description: "A colossal neoclassical sculpture on Liberty Island.",
                image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Statue_of_Liberty_7.jpg",
                done: true
            },
            {
                id: 3,
                name: "Times Square",
                lat: 40.758896,
                lng: -73.985130,
                description: "Major commercial intersection and tourist destination.",
                image: "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
                done: false
            }
        ]
    },
    "tokyo": {
        name: "Tokyo",
        country: "Japan",
        coordinates: { lat: 35.6762, lng: 139.6503 },
        description: "A mix of ultramodern and traditional, from neon-lit skyscrapers to historic temples.",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg",
        places: [
            {
                id: 1,
                name: "Senso-ji",
                lat: 35.7148,
                lng: 139.7967,
                description: "Ancient Buddhist temple located in Asakusa.",
                image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Sensoji_2019-04-03_%281%29.jpg",
                done: true
            },
            {
                id: 2,
                name: "Tokyo Tower",
                lat: 35.6586,
                lng: 139.7454,
                description: "Communications and observation tower in the Shiba-koen district.",
                image: "https://upload.wikimedia.org/wikipedia/commons/3/37/Tokyo_Tower_and_Tokyo_Eiffel_Tower.jpg",
                done: false
            }
        ]
    }
};

// Helper: Get City ID from URL
function getCityId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('cityId') || 'paris'; // Default to Paris if not found
}

function getCityData() {
    const id = getCityId();
    return MOCK_DATA[id] || MOCK_DATA['paris'];
}
