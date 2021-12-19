const e = require("express");
const express = require("express");
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize("sequelize_db", "m", "", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});
const server = express();

server.listen(8080);

server.post("/removecampusbyid", (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    async function remove() {
      await Campus.destroy({
        where: {
          id: body,
        },
      });
      res.end("Campus deleted");
    }
    remove();
  });
});

server.post("/enrolledstudents", (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    let enrolledStudents = "";
    async function getEnrolledStudents() {
      const viewStudents = await Student.findAll({
        where: {
          CampusId: body,
        },
      });
      console.log(viewStudents.every((student) => student instanceof Student));
      console.log("Enrolled students:", JSON.stringify(viewStudents));
      enrolledStudents = JSON.stringify(viewStudents);
      res.end(enrolledStudents);
    }
    getEnrolledStudents();
  });
});

server.post("/editcampus", (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    async function edit() {
      await Campus.update(body, {
        where: {
          id: body.id,
        },
        returning: true,
      });
      res.end("Edited");
    }
    edit();
  });
});

server.post("/editstudent", (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    if (body.gpa === "") {
      body.gpa = null;
    }
    async function edit() {
      await Student.update(body, {
        where: {
          id: body.id,
        },
      }).then(function (result) {
        console.log(result);
      });
      res.end("Edited");
      const matchingCampuses = await Campus.findAll({
        where: {
          name: body.college,
          address: body.collegeAddress,
        },
      });
      console.log("*" + matchingCampuses);
      if (matchingCampuses.length > 1) {
        // const campuses = Campus.build({
        //   name: body.college,
        //   address: body.collegeAddress,
        // });
        // newStudent.setCampus(campuses);
        // console.log(newStudent);
        async function edit() {
          console.log("%" + matchingCampuses[0].id);
          await Campus.update(
            {
              CampusId: matchingCampuses[0].id,
            },
            {
              where: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
              },
              returning: true,
            }
          );
        }
        edit();
      } else {
        async function createCampus() {
          await Campus.destroy({
            where: {
              name: body.college,
              address: body.collegeAddress,
            },
          });
          const newCampus = await Campus.create({
            name: body.college,
            address: body.collegeAddress,
          });
          console.log(newCampus.id);
          console.log("%" + newCampus.id);
          async function edit() {
            await Student.update(
              {
                CampusId: newCampus.id,
              },
              {
                where: {
                  firstName: body.firstName,
                  lastName: body.lastName,
                  email: body.email,
                },
                returning: true,
              }
            );
          }
          edit();
        }
        createCampus();
      }
    }
    edit();
  });
});

server.post("/getcampus", (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    let oneCampus = "";
    async function viewCampus() {
      const viewCampus = await Campus.findAll({
        where: {
          id: body,
        },
      });
      console.log(viewCampus.every((campus) => campus instanceof Campus));
      console.log("One campus:", JSON.stringify(viewCampus));
      oneCampus = JSON.stringify(viewCampus);
      res.end(oneCampus);
    }
    viewCampus();
  });
});

server.post("/getstudent", (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    let oneStudent = "";
    async function viewStudent() {
      const viewStudent = await Student.findAll({
        where: {
          id: body,
        },
      });
      console.log(viewStudent.every((student) => student instanceof Student));
      console.log("One student:", JSON.stringify(viewStudent));
      oneStudent = JSON.stringify(viewStudent);
      res.end(oneStudent);
    }
    viewStudent();
  });
});

server.post("/removeStudent", (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    async function removeStudent() {
      await Student.destroy({
        where: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
        },
      });
    }
    removeStudent();
    res.end("removed");
  });
});

server.post("/removeCampus", (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    async function removeCampus() {
      await Campus.destroy({
        where: {
          name: body.name,
          address: body.address,
        },
      });
    }
    removeCampus();
    res.end("removed");
  });
});

server.post("/campuses", (req, res) => {
  let allCampuses = "";
  async function viewCampuses() {
    const viewCampuses = await Campus.findAll();
    console.log(viewCampuses.every((campus) => campus instanceof Campus));
    console.log("All campuses:", JSON.stringify(viewCampuses));
    allCampuses = JSON.stringify(viewCampuses);
    res.end(allCampuses);
  }
  viewCampuses();
});

server.post("/students", (req, res) => {
  let allStudents = "";
  async function viewStudents() {
    const viewStudents = await Student.findAll();
    console.log(viewStudents.every((student) => student instanceof Student));
    console.log("All students:", JSON.stringify(viewStudents));
    allStudents = JSON.stringify(viewStudents);
    res.end(allStudents);
  }
  viewStudents();
});

server.get("/", () => {
  console.log("hello");
});

class Campus extends Model {}

Campus.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imgUrl: {
      type: DataTypes.STRING,
      defaultValue: "https://i.ibb.co/LS7GxDK/college.png",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Campus",
    timestamps: true,
  }
);

console.log(Campus === sequelize.models.Campus); // true
console.log(sequelize.models);

class Student extends Model {}

Student.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: "https://i.ibb.co/cQDsxMD/student.webp",
    },
    gpa: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0.0,
        max: 4.0,
      },
    },
    college: {
      type: DataTypes.STRING,
    },
    collegeAddress: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Student",
    timestamps: true,
  }
);
console.log(Student === sequelize.models.Student); // true
console.log(sequelize.models);

Student.belongsTo(Campus);
Campus.hasMany(Student);

async function sync() {
  await sequelize.sync();
}

sync();

const addStudent = (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    async function createStudent() {
      await Student.destroy({
        where: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
        },
      });
      const newStudent = await Student.create(body);
      console.log(newStudent);
      const matchingCampuses = await Campus.findAll({
        where: {
          name: body.college,
          address: body.collegeAddress,
        },
      });
      console.log("*" + matchingCampuses);
      if (matchingCampuses.length > 1) {
        // const campuses = Campus.build({
        //   name: body.college,
        //   address: body.collegeAddress,
        // });
        // newStudent.setCampus(campuses);
        // console.log(newStudent);
        async function edit() {
          console.log("%" + matchingCampuses[0].id);
          await Campus.update(
            {
              CampusId: matchingCampuses[0].id,
            },
            {
              where: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
              },
              returning: true,
            }
          );
        }
        edit();
      } else {
        async function createCampus() {
          await Campus.destroy({
            where: {
              name: body.college,
              address: body.collegeAddress,
            },
          });
          const newCampus = await Campus.create({
            name: body.college,
            address: body.collegeAddress,
          });
          console.log(newCampus.id);
          console.log("%" + newCampus.id);
          async function edit() {
            await Student.update(
              {
                CampusId: newCampus.id,
              },
              {
                where: {
                  firstName: body.firstName,
                  lastName: body.lastName,
                  email: body.email,
                },
                returning: true,
              }
            );
          }
          edit();
        }
        createCampus();
        // const buildCampuses = Campus.build({
        //   name: body.college,
        //   address: body.collegeAddress,
        // });
        // newStudent.setCampus(buildCampuses);
        // async function getAssociation() {
        //   const associatedCampus = await newStudent.getCampus();
        //   console.log("^" + associatedCampus);
        // }
        // getAssociation();
      }
      console.log(matchingCampuses.every((campus) => campus instanceof Campus));

      console.log(newStudent.id);
      res.end("recorded");
    }
    createStudent();
    async function viewStudents() {
      const viewStudents = await Student.findAll();
      console.log(viewStudents.every((student) => student instanceof Student));
      console.log("All students:", JSON.stringify(viewStudents));
    }
    viewStudents();
    async function findTables() {
      sequelize
        .getQueryInterface()
        .showAllSchemas()
        .then((tableObj) => {
          console.log("// Tables in database", "==========================");
          console.log(tableObj);
        })
        .catch((err) => {
          console.log("showAllSchemas ERROR", err);
        });
    }
    async function sync() {
      await sequelize.sync();
    }

    sync();
    findTables();
  });
};

const addCampus = (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    async function createCampus() {
      await Campus.destroy({
        where: {
          name: body.name,
          address: body.address,
        },
      });
      const newCampus = await Campus.create(body);
      console.log(newCampus.id);
      res.end("recorded");
    }
    createCampus();
    async function viewCampuses() {
      const viewCampuses = await Campus.findAll();
      console.log(viewCampuses.every((campus) => campus instanceof Campus));
      console.log("All campuses:", JSON.stringify(viewCampuses));
    }
    viewCampuses();
    async function findTables() {
      sequelize
        .getQueryInterface()
        .showAllSchemas()
        .then((tableObj) => {
          console.log("// Tables in database", "==========================");
          console.log(tableObj);
        })
        .catch((err) => {
          console.log("showAllSchemas ERROR", err);
        });
    }
    async function sync() {
      await sequelize.sync();
    }

    sync();
    findTables();
  });
};

server.post("/addstudent", (req, res) => {
  addStudent(req, res);
});

server.post("/addcampus", (req, res) => {
  addCampus(req, res);
});
