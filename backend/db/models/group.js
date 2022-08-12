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
      Group.belongsTo(models.User, { foreignKey: "organizerId" });
    }
  }
  Group.init(
    {
      organizerId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [3, 60] },
      },
      about: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [50] },
      },
      type: DataTypes.ENUM,
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
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
