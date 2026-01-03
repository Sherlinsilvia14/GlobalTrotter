const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activity = sequelize.define('Activity', {
    activity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'city_stops',
            key: 'city_id'
        }
    },
    activity_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    day: {
        type: DataTypes.INTEGER, // Which day within the trip/city
        allowNull: true
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    duration: {
        type: DataTypes.STRING, // e.g., "2 hours", "Half Day"
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'activities'
});

module.exports = Activity;
