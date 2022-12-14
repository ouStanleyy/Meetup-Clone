"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Membership.belongsTo(models.User, { foreignKey: "memberId" });
      Membership.belongsTo(models.Group, { foreignKey: "groupId" });
    }
  }
  Membership.init(
    {
      groupId: { type: DataTypes.INTEGER, allowNull: false },
      memberId: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM("host", "co-host", "member", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Membership",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    }
  );
  return Membership;
};
