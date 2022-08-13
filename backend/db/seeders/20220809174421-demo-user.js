"use strict";

const bcrypt = require("bcryptjs");
const { User, Group, Event } = require("../models");

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
        status: "host",
        events: [
          {
            venue: {
              address: "123 Demo Street",
              city: "Demo City",
              state: "Demo State",
              lat: 123.4567,
              lng: 234.5678,
            },

            name: "Demo Event",
            description: "Demo description.",
            type: "In person",
            capacity: 10,
            price: 99.99,
            startDate: new Date("December 17, 2022 03:00:00").toString(),
            endDate: new Date("December 24, 2022 03:00:00").toString(),
            status: "host",
          },
        ],
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
        status: "member",
        events: [
          {
            name: "Demo Event",
            status: "member",
          },
        ],
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
        status: "host",
        events: [
          {
            venue: {
              address: "123 Wannabe Avenue",
              city: "Wannabe City",
              state: "Wannabe State",
              lat: 87.6543211,
              lng: 123.4567899,
            },

            name: "Wannabe Event",
            description: "Wannabe description.",
            capacity: 20,
            price: 199.99,
            startDate: new Date("November 05, 2022 03:00:00").toString(),
            endDate: new Date("November 15, 2022 03:00:00").toString(),
            status: "host",
          },
        ],
      },
      {
        name: "Demo Group",
        status: "member",
        events: [
          {
            name: "Demo Event",
            status: "member",
          },
        ],
      },
    ],
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const user of users) {
      const { groups } = user;
      delete user.groups;

      const newUser = await User.create(user);

      for (const group of groups) {
        const { name, status, events } = group;
        delete group.status, group.events;
        let newGroup;

        if (status === "host") newGroup = await newUser.createGroup(group);
        else newGroup = await Group.findOne({ where: { name } });

        await newUser.createMembership({
          groupId: newGroup.id,
          status,
        });

        for (const event of events) {
          const { name, venue, status } = event;
          delete event.venue, event.status;
          let newEvent;

          if (venue) {
            const newVenue = await newGroup.createVenue(venue);
            newEvent = await newGroup.createEvent({
              ...event,
              venueId: newVenue.id,
            });
          } else newEvent = await Event.findOne({ where: { name } });

          await newUser.createAttendance({ eventId: newEvent.id, status });
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    for (const user of users) {
      const { email } = user;
      await User.destroy({ where: { email } });
    }
  },
};
