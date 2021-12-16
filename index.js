const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("postgres::memory:");

const server = express();

server.listen(8080);

server.get("/", () => {
  console.log("hello");
});

server.get("/addstudent", addStudent());

server.get("/addcampus", addCampus());

const addStudent = () => {};

const addCampus = () => {};

const createModels = () => {
  const campuses = sequelize.define(
    "campuses",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imgUrl: {
        type: DataTypes.STRING,
        defaultValue: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      // Other model options go here
    }
  );

  // `sequelize.define` also returns the model
  console.log(campuses === sequelize.models.campuses); // true
  console.log(sequelize.models);

  const students = sequelize.define(
    "students",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue: true,
      },
      gpa: {
        type: DataTypes.DECIMAL,
        validate: {
          min: 0.0,
          max: 4.0,
        },
      },
    },
    {
      // Other model options go here
    }
  );

  // `sequelize.define` also returns the model
  console.log(students === sequelize.models.students); // true
  console.log(sequelize.models);
};

createModels();
