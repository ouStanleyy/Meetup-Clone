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
        name: "Evening Tennis Under the Bridge",
        about:
          "Enjoy rounds of tennis with a tight-nit group of people under the Williamsburg Bridge. Singles or doubles.",
        type: "In person",
        private: false,
        city: "New York",
        state: "NY",
        status: "host",
        images: [
          "https://static01.nyt.com/images/2018/08/26/autossell/26courts5/merlin_142304082_b4c1a4c6-eab5-46d1-a6cb-695632b10b4e-superJumbo.jpg?quality=75&auto=webp",
        ],
        events: [
          {
            venue: {
              address: "FDR Dr",
              city: "New York",
              state: "NY",
              lat: 40.715326,
              lng: -73.975493,
            },
            name: "Tennis Group First Meet and Greet",
            description:
              "First meet and greet event for the evening tennis under the bridge group! Join us online for happy times!",
            type: "Online",
            capacity: 20,
            price: 18.5,
            startDate: new Date("December 17, 2022 10:00:00").toString(),
            endDate: new Date("December 17, 2022 12:00:00").toString(),
            status: "member",
            images: [
              "https://assets.dnainfo.com/generated/photo/2014/03/east-rivar-park-tennis-courts--1395434904.jpg/extralarge.jpgl",
            ],
          },
        ],
      },
    ],
  },
  {
    firstName: "Daniel",
    lastName: "Wong",
    email: "dwong@email.io",
    password: bcrypt.hashSync("dwongpassword"),
    groups: [
      {
        name: "Evening Tennis Under the Bridge",
        status: "member",
        events: [
          {
            name: "Tennis Group First Meet and Greet",
            status: "member",
          },
        ],
      },
    ],
  },
  {
    firstName: "Stanley",
    lastName: "Ou",
    email: "sou@email.io",
    password: bcrypt.hashSync("soupassword"),
    groups: [
      {
        name: "Couch Co-op Gaming",
        about:
          "Battle it out or band together. Hours of excitement gaming together like the good ole days!",
        type: "In person",
        city: "Brooklyn",
        state: "NY",
        status: "host",
        images: [
          "https://www.online-tech-tips.com/wp-content/uploads/2020/01/gaming-on-couch-1.jpeg",
        ],
        events: [
          {
            venue: {
              address: "339 Troutman St",
              city: "Brooklyn",
              state: "NY",
              lat: 40.705225,
              lng: -73.924376,
            },
            name: "Nintendo Co-op Night!",
            description:
              "Come and enjoy the best titles from the king of co-op gaming, Nintendo!",
            capacity: 10,
            price: 4.99,
            startDate: new Date("December 24, 2022 17:00:00").toString(),
            endDate: new Date("December 24, 2022 21:00:00").toString(),
            status: "member",
            images: [
              "https://images.nintendolife.com/d05934c36db9e/best-nintendo-switch-couch-co-op-games.large.jpg",
            ],
          },
        ],
      },
      {
        name: "Evening Tennis Under the Bridge",
        status: "member",
        events: [
          {
            name: "Tennis Group First Meet and Greet",
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
        const { name, status, events, images } = group;
        delete group.status, group.events, group.images;
        let newGroup;

        if (status === "host") newGroup = await newUser.createGroup(group);
        else newGroup = await Group.findOne({ where: { name } });

        await newUser.createMembership({
          groupId: newGroup.id,
          status,
        });

        if (images) {
          for (const image of images) {
            await newGroup.createImage({ userId: newUser.id, url: image });
          }
        }

        for (const event of events) {
          const { name, venue, status, images } = event;
          delete event.venue, event.status, event.images;
          let newEvent;

          if (venue) {
            const newVenue = await newGroup.createVenue(venue);
            newEvent = await newGroup.createEvent({
              ...event,
              venueId: newVenue.id,
            });
          } else newEvent = await Event.findOne({ where: { name } });

          await newUser.createAttendance({ eventId: newEvent.id, status });

          if (images) {
            for (const image of images) {
              await newEvent.createImage({ userId: newUser.id, url: image });
            }
          }
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
