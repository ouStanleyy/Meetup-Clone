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
        city: "Wannabe City",
        state: "Wannabe State",
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
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
      });

      for (const group of groups) {
        const {
          name,
          about,
          type,
          private: prv,
          city,
          state,
          organizer,
        } = group;

        if (organizer) {
          const newGroup = await newUser.createGroup({
            name,
            about,
            type,
            private: prv,
            city,
            state,
          });
          await newUser.createMembership({
            groupId: newGroup.id,
            status: "host",
          });
        } else {
          const queriedGroup = await Group.findOne({ where: { name } });
          await newUser.createMembership({
            groupId: queriedGroup.id,
            status: "member",
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
