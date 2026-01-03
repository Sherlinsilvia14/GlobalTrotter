const sequelize = require('../config/database');
const User = require('./User');
const Trip = require('./Trip');
const CityStop = require('./CityStop');
const Activity = require('./Activity');

// Associations
User.hasMany(Trip, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'user_id' });

Trip.hasMany(CityStop, { foreignKey: 'trip_id', onDelete: 'CASCADE' });
CityStop.belongsTo(Trip, { foreignKey: 'trip_id' });

CityStop.hasMany(Activity, { foreignKey: 'city_id', onDelete: 'CASCADE' });
Activity.belongsTo(CityStop, { foreignKey: 'city_id' });

module.exports = {
    sequelize,
    User,
    Trip,
    CityStop,
    Activity
};
