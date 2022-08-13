"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.Group, { foreignKey: "groupId" });
      Event.belongsTo(models.Venue, { foreignKey: "venueId" });
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Event.init(
    {
      groupId: { type: DataTypes.INTEGER, allowNull: false },
      venueId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [3, 60] },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: { len: [50] },
      },
      type: {
        type: DataTypes.ENUM("Online", "In person"),
        allowNull: false,
        defaultValue: "Online",
      },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL, allowNull: false },
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
