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
      Event.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageableType: "Event",
        },
      });
    }
  }
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        get() {
          return this.getDataValue("id");
        },
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        get() {
          return this.getDataValue("groupId");
        },
      },
      venueId: {
        type: DataTypes.INTEGER,
        get() {
          return this.getDataValue("venueId");
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [3, 60] },
        get() {
          return this.getDataValue("name");
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: { len: [50] },
        get() {
          return this.getDataValue("description");
        },
      },
      type: {
        type: DataTypes.ENUM("Online", "In person"),
        allowNull: false,
        defaultValue: "Online",
        get() {
          return this.getDataValue("type");
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        get() {
          return this.getDataValue("capacity");
        },
      },
      price: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        get() {
          return this.getDataValue("price");
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return this.getDataValue("startDate").toLocaleString("sv");
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return this.getDataValue("endDate").toLocaleString("sv");
        },
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
