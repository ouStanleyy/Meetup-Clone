"use strict";

const bcrypt = require("bcryptjs");
const { User, Group } = require("../models");

const users = [
  {
    firstName: "Demo",
    lastName: "User",
    email: "demo@user.io",
    password: bcrypt.hashSync("demopassword"),
    groups: [
      {
        name: "Demo Group",
        about: "Demo description.",
        type: "In person",
        private: false,
        city: "Demo City",
        state: "Demo State",
        organizer: true,
      },
    ],
  },
  {
    firstName: "Fake",
    lastName: "User",
    email: "fake@user.io",
    password: bcrypt.hashSync("fakepassword"),
    groups: [
      {
        name: "Demo Group",
        about: "Demo description.",
        type: "In person",
        private: false,
        city: "Demo City",
        state: "Demo State",
        organizer: false,
      },
    ],
  },
  {
    firstName: "Wannabe",
    lastName: "User",
    email: "wannabe@user.io",
    password: bcrypt.hashSync("wannabepassword"),
    groups: [
      {
        name: "Wannabe Group",
        about: "Wannabe description.",
        city: "Demo City",
        state: "Demo State",
        organizer: true,
      },
      {
        name: "Demo Group",
        about: "Demo description.",
        type: "In person",
        private: false,
        city: "Demo City",
        state: "Demo State",
        organizer: false,
      },
    ],
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const user of users) {
      const { firstName, lastName, email, password, groups } = user;
      const newUser = User.create({ firstName, lastName, email, password });

      for (const group of groups) {
        const { name, about, type, private, city, state, organizer } = group;

        if (organizer) {
          const newGroup = newUser.createGroup({
            name,
            about,
            type,
            private,
            city,
            state,
          });
        }
      }
    }
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
