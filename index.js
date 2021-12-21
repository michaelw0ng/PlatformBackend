const express = require("express");
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize("sequelize_db", "m", "", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});
const server = express();

server.listen(8080);

server.post("/unenrollstudent", (req, res) => {
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
    async function unenrollStudent() {
      await Student.update(
        {
          CampusId: null,
          collegeAddress: null,
          college: null,
        },
        {
          where: {
            id: body.id,
          },
          returning: true,
        }
      );
      res.end("Unenrolled");
    }
    unenrollStudent();
  });
});

server.post("/enrollstudent", (req, res) => {
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

    async function enrollStudent() {
      let name = "";
      let address = "";
      async function viewCampus() {
        const viewCampus = await Campus.findAll({
          where: {
            id: body.CampusId,
          },
        });
        console.log(viewCampus.every((campus) => campus instanceof Campus));
        name = viewCampus[0].dataValues.name;
        address = viewCampus[0].dataValues.address;
        await Student.update(
          {
            CampusId: body.CampusId,
            college: name,
            collegeAddress: address,
          },
          {
            where: {
              id: body.id,
            },
            returning: true,
          }
        );
        res.end("Enrolled");
      }
      viewCampus();
    }
    enrollStudent();
  });
});

server.post("/unaffiliatedstudents", (req, res) => {
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
    let unaffiliatedStudents = "";
    async function getUnaffiliatedStudents() {
      const viewStudents = await Student.findAll({
        where: {
          CampusId: {
            [Sequelize.Op.or]: {
              [Sequelize.Op.ne]: body,
              [Sequelize.Op.eq]: null,
            },
          },
        },
      });
      console.log(viewStudents.every((student) => student instanceof Student));
      console.log("Unaffiliated students:", JSON.stringify(viewStudents));
      unaffiliatedStudents = JSON.stringify(viewStudents);
      res.end(unaffiliatedStudents);
    }
    getUnaffiliatedStudents();
  });
});

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

server.post("/removestudentbyid", (req, res) => {
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
      await Student.destroy({
        where: {
          id: body,
        },
      });
      res.end("Student deleted");
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
    if (
      body.college === null ||
      body.collegeAddress === null ||
      body.college === "" ||
      body.collegeAddress === "" ||
      body.college === undefined ||
      body.collegeAddress === undefined
    ) {
      body.CampusId = null;
      async function edit() {
        await Student.update(body, {
          where: {
            id: body.id,
          },
        }).then(function (result) {
          console.log(result);
        });
        res.end("Edited");
        console.log("hello");
        console.log(body.college);
        if (
          body.college === null ||
          body.collegeAddress === null ||
          body.college === "" ||
          body.collegeAddress === "" ||
          body.college === undefined ||
          body.collegeAddress === undefined
        ) {
          return;
        }
        const matchingCampuses = await Campus.findAll({
          where: {
            name: body.college,
            address: body.collegeAddress,
          },
        });
        console.log("*" + matchingCampuses);
        if (matchingCampuses.length < 1) {
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
            async function editStudent() {
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
            editStudent();
          }
          createCampus();
        }
      }
      edit();
    } else {
      async function getCampusId() {
        const getCampus = await Campus.findAll({
          where: {
            name: body.college,
            address: body.collegeAddress,
          },
        });
        if (getCampus.length >= 1) {
          body.CampusId = getCampus[0].dataValues.id;
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
          console.log("hello");
          console.log(body.college);
          if (
            body.college === null ||
            body.collegeAddress === null ||
            body.college === "" ||
            body.collegeAddress === "" ||
            body.college === undefined ||
            body.collegeAddress === undefined
          ) {
            return;
          }
          const matchingCampuses = await Campus.findAll({
            where: {
              name: body.college,
              address: body.collegeAddress,
            },
          });
          console.log("*" + matchingCampuses);
          if (matchingCampuses.length < 1) {
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
              async function editStudent() {
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
              editStudent();
            }
            createCampus();
          }
        }
        edit();
      }
      getCampusId();
    }
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

server.get("/campuses", (req, res) => {
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

server.get("/students", (req, res) => {
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
      type: DataTypes.TEXT("long"),
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
      type: DataTypes.TEXT("long"),
    },
  },
  {
    sequelize,
    modelName: "Campus",
    timestamps: true,
  }
);

console.log(Campus === sequelize.models.Campus);
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
      type: DataTypes.TEXT("long"),
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
console.log(Student === sequelize.models.Student);
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
      if (
        body.college === null ||
        body.collegeAddress === null ||
        body.college === "" ||
        body.collegeAddress === "" ||
        body.college === undefined ||
        body.collegeAddress === undefined
      ) {
        res.end("recorded");
        return;
      }
      const matchingCampuses = await Campus.findAll({
        where: {
          name: body.college,
          address: body.collegeAddress,
        },
      });
      console.log("*" + matchingCampuses);
      if (matchingCampuses.length >= 1) {
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
    async function sync() {
      await sequelize.sync();
    }
    sync();
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
  });
};

server.post("/addstudent", (req, res) => {
  addStudent(req, res);
});

server.post("/addcampus", (req, res) => {
  addCampus(req, res);
});
