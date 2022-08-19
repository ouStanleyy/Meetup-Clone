"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
        as: "Organizer",
      });
      Group.hasMany(models.Membership, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Group.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageableType: "Group",
        },
      });
    }
  }
  Group.init(
    {
      organizerId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [3, 60] },
      },
      about: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: { len: [50] },
      },
      type: {
        type: DataTypes.ENUM("Online", "In person"),
        allowNull: false,
        defaultValue: "Online",
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return this.getDataValue("createdAt").toLocaleString("sv");
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return this.getDataValue("updatedAt").toLocaleString("sv");
        },
      },
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
