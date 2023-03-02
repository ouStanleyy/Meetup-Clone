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
            startDate: new Date("June 17, 2023 10:00:00").toString(),
            endDate: new Date("June 17, 2023 12:00:00").toString(),
            status: "member",
            images: [
              "https://assets.dnainfo.com/generated/photo/2014/03/east-rivar-park-tennis-courts--1395434904.jpg/extralarge.jpg",
            ],
          },
        ],
      },
      {
        name: "Weekend Warriors",
        about: "Weekends are short, so enjoy them to the fullest!",
        type: "In person",
        city: "New York",
        state: "NY",
        status: "host",
        images: [
          "https://media.istockphoto.com/id/682516816/vector/weekend-loading-vector-illustration-yellow-background.jpg?s=612x612&w=0&k=20&c=bdOsuqje_0FXsSlAImInhH26deJWreZXiSb1Jm_p4M0=",
        ],
        events: [
          {
            venue: {
              address: "79th Street & 85th Street",
              city: "New York",
              state: "NY",
              lat: 40.781646,
              lng: -73.966436,
            },
            name: "Picnic!",
            description: "Food will be provided, but BYOB!",
            capacity: 50,
            price: 19.99,
            startDate: new Date("June 24, 2023 10:00:00").toString(),
            endDate: new Date("June 24, 2023 18:00:00").toString(),
            status: "member",
            images: [
              "https://d32ydbgkw6ghe6.cloudfront.net/production/uploads/cover_images/e8104da779cc2d450ffa1fb53492dffe42f5/i1080x475.jpg",
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
        name: "Gym Rats",
        about: "Zero rest days, zero cheat days, all gains.",
        type: "In person",
        city: "Queens",
        state: "NY",
        status: "host",
        images: [
          "https://media.timeout.com/images/105928521/1372/772/image.jpg",
        ],
        events: [
          {
            venue: {
              address: "29-22 Northern Blvd",
              city: "Queens",
              state: "NY",
              lat: 40.74947,
              lng: -73.936139,
            },
            name: "Arm Day",
            description: "Every day is arm day.",
            capacity: 10,
            price: 4.99,
            startDate: new Date("May 12, 2023 10:00:00").toString(),
            endDate: new Date("May 12, 2023 12:00:00").toString(),
            status: "member",
            images: [
              "https://barbend.com/wp-content/uploads/2022/03/shutterstock_1543790417.jpg",
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
      {
        name: "Weekend Warriors",
        status: "member",
        events: [
          {
            name: "Picnic!",
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
            startDate: new Date("July 24, 2023 17:00:00").toString(),
            endDate: new Date("July 24, 2023 21:00:00").toString(),
            status: "member",
            images: [
              "https://images.nintendolife.com/d05934c36db9e/best-nintendo-switch-couch-co-op-games.large.jpg",
            ],
          },
        ],
      },
      {
        name: "Techies For Life",
        about: "Join us for all things tech. We attend monthly hackathons.",
        type: "In person",
        city: "New York",
        state: "NY",
        status: "host",
        images: [
          "https://miro.medium.com/v2/resize:fit:4800/0*UNHfTP1jvD3yk-iZ.",
        ],
        events: [
          {
            venue: {
              address: "170E E 2nd St",
              city: "New York",
              state: "NY",
              lat: 40.723297,
              lng: -73.98392,
            },
            name: "Monthly Hackathon",
            description: "Time for another hackathon!",
            capacity: 20,
            price: 9.99,
            startDate: new Date("April 18, 2023 13:00:00").toString(),
            endDate: new Date("April 18, 2023 16:00:00").toString(),
            status: "member",
            images: [
              "https://images.squarespace-cdn.com/content/v1/5e6542d2ae16460bb741a9eb/1603318636443-A846ACUKNYUBA0RPLJ94/marvin-meyer-SYTO3xs06fU-unsplash.jpg?format=1500w",
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
      {
        name: "Weekend Warriors",
        status: "member",
        events: [
          {
            name: "Picnic!",
            status: "member",
          },
        ],
      },
      {
        name: "Gym Rats",
        status: "member",
        events: [
          {
            name: "Arm Day",
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
