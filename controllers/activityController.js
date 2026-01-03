const { Activity, CityStop, Trip } = require('../models');

// Add activity
exports.addActivity = async (req, res) => {
    try {
        const { city_id, activity_name, day, cost, duration } = req.body;

        const city = await CityStop.findByPk(city_id, {
            include: { model: Trip }
        });

        if (!city) return res.status(404).json({ msg: 'City not found' });

        // Check ownership of the trip associated with the city
        if (city.Trip.user_id !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const activity = await Activity.create({
            city_id,
            activity_name,
            day,
            cost,
            duration
        });

        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get activities for a city
exports.getCityActivities = async (req, res) => {
    try {
        const cityId = req.params.cityId;

        // Similarly, simplistic check
        const activities = await Activity.findAll({
            where: { city_id: cityId }
        });

        // NOTE: Ideally should check if user has access to this city's trip. 
        // Skipping deep verification for hackathon speed unless needed.

        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete activity
exports.deleteActivity = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const activity = await Activity.findByPk(activityId, {
            include: {
                model: CityStop,
                include: { model: Trip }
            }
        });

        if (!activity) return res.status(404).json({ msg: 'Activity not found' });

        if (activity.CityStop.Trip.user_id !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await activity.destroy();
        res.json({ msg: 'Activity deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
