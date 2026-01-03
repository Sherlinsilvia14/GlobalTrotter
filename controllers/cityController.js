const { CityStop, Trip } = require('../models');

// Add city to trip
exports.addCity = async (req, res) => {
    try {
        const { trip_id, city_name, start_day, end_day, city_order } = req.body;

        // Check if trip exists
        const trip = await Trip.findByPk(trip_id);
        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        // Verify ownership
        if (trip.user_id !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to add cities to this trip' });
        }

        const city = await CityStop.create({
            trip_id,
            city_name,
            start_day,
            end_day,
            city_order
        });

        res.json(city);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all cities for a trip
exports.getTripCities = async (req, res) => {
    try {
        const tripId = req.params.tripId;

        // Optional: Verification if user can view this trip (public or owned)
        // For simplicity, we assume if they can get the trip ID they can see cities, 
        // or re-use logic from tripController.getPublicTrip.
        // Let's implement partial check: 
        const trip = await Trip.findByPk(tripId);
        if (!trip) return res.status(404).json({ msg: 'Trip not found' });

        if (!trip.is_public && trip.user_id !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const cities = await CityStop.findAll({
            where: { trip_id: tripId },
            order: [['city_order', 'ASC']]
        });

        res.json(cities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Reorder cities
exports.reorderCities = async (req, res) => {
    try {
        const { trip_id, cityOrders } = req.body;
        // cityOrders expected to be [{ city_id: 1, city_order: 1 }, { city_id: 2, city_order: 2 }]

        const trip = await Trip.findByPk(trip_id);
        if (!trip) return res.status(404).json({ msg: 'Trip not found' });

        if (trip.user_id !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Transaction usage would be better here, but omitting for simplicity
        for (const item of cityOrders) {
            await CityStop.update(
                { city_order: item.city_order },
                { where: { city_id: item.city_id, trip_id: trip_id } }
            );
        }

        res.json({ msg: 'Cities reordered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
