"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("Admin@123", 10);

    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Super Admin 1",
          email: "admin1@example.com",
          phone: "9991110001",
          password: passwordHash,
          role: "ADMIN",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Super Admin 2",
          email: "admin2@example.com",
          phone: "9991110002",
          password: passwordHash,
          role: "ADMIN",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Super Admin 3",
          email: "admin3@example.com",
          phone: "9991110003",
          password: passwordHash,
          role: "ADMIN",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", {
      role: "ADMIN",
    });
  },
};
