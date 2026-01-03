const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CityStop = sequelize.define('CityStop', {
    city_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    trip_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trips',
            key: 'trip_id'
        }
    },
    city_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_day: {
        type: DataTypes.INTEGER, // e.g., Day 1 of the trip
        allowNull: true
    },
    end_day: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    city_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: true,
    tableName: 'city_stops'
});

module.exports = CityStop;
