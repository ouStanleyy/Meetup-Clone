"use strict";
const { Model, Op, Validator } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, email } = this;
      return { id, email };
    }
    validatePassword(pwd) {
      return bcrypt.compareSync(pwd, this.password.toString());
    }
    static getCurrentUserById(id) {
      return this.scope("currentUser").findByPk(id);
    }
    static async login({ email, password }) {
      const user = await this.scope("loginUser").findOne({
        where: { email },
      });
      if (user && user.validatePassword(password))
        return await this.getCurrentUserById(user.id);
    }
    static async signup({ firstName, lastName, email, password: pwd }) {
      const password = bcrypt.hashSync(pwd);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
      });
      return await this.getCurrentUserById(user.id);
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Group, {
        foreignKey: "organizerId",
        onDelete: "CASCADE",
        hooks: true,
      });
      User.hasMany(models.Membership, { foreignKey: "memberId" });
      User.hasMany(models.Attendance, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
      User.hasMany(models.Image, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value))
              throw new Error("Username cannot be an email.");
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value))
              throw new Error("Username cannot be an email.");
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "User with that email already exists",
        },
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: ["id", "firstName", "lastName"],
      },
      scopes: {
        currentUser: {
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        loginUser: {
          attributes: {},
        },
      },
    }
  );
  return User;
};
