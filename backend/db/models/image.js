"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    getCommentable(options) {
      if (!this.imageableType) return Promise.resolve(null);
      const mixinMethodName = `get${this.imageableType}`;
      return this[mixinMethodName](options);
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Event, {
        foreignKey: "imageableId",
        constraints: false,
      });
      Image.belongsTo(models.Group, {
        foreignKey: "imageableId",
        constraints: false,
      });
      Image.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Image.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      imageableId: { type: DataTypes.INTEGER, allowNull: false },
      imageableType: {
        type: DataTypes.ENUM("Event", "Group"),
        allowNull: false,
      },
      url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Image",
      defaultScope: {
        attributes: ["id", "imageableId", "url"],
      },
    }
  );
  return Image;
};
