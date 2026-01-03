const { Trip, CityStop, Activity, sequelize } = require('../models');

// Calculate total trip cost
exports.getTripBudget = async (req, res) => {
    try {
        const tripId = req.params.tripId;

        const trip = await Trip.findByPk(tripId);
        if (!trip) return res.status(404).json({ msg: 'Trip not found' });

        if (!trip.is_public && trip.user_id !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // Requirement: "Calculate total trip cost using SQL JOINs"
        // We can do this via Sequelize aggregate function
        /*
        SELECT SUM(activities.cost) as totalCost
        FROM activities
        JOIN city_stops ON activities.city_id = city_stops.city_id
        WHERE city_stops.trip_id = :tripId
        */

        // This is a direct query approach which demonstrates SQL knowledge effectively, or utilize Sequelize mixins.
        // Let's use Sequelize's `findAll` with sum or `sum` method if associations align, 
        // but since Activity -> CityStop -> Trip, we can query Activity with include.

        // However, Sequelize `sum` on the model is easiest if we can filter by associated trip.
        // Activity.sum('cost', { include: ... })

        const totalCost = await Activity.sum('cost', {
            include: [{
                model: CityStop,
                attributes: [], // We don't need city columns
                where: { trip_id: tripId }
            }]
        });

        res.json({
            trip_id: tripId,
            total_cost: totalCost || 0
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
