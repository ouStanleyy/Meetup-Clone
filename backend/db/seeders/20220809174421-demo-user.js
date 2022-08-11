"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Demo",
          lastName: "User",
          email: "demo@user.io",
          password: bcrypt.hashSync("demopassword"),
        },
        {
          firstName: "Fake",
          lastName: "User",
          email: "fake@user.io",
          password: bcrypt.hashSync("fakepassword"),
        },
        {
          firstName: "Wannabe",
          lastName: "User",
          email: "wannabe@user.io",
          password: bcrypt.hashSync("wannabepassword"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Users",
      {
        email: ["demo@user.io", "fake@user.io", "wannabe@user.io"],
      },
      {}
    );
  },
};
