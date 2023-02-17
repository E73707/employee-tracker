const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const { up } = require("inquirer/lib/utils/readline");
const { type } = require("os");
const { number } = require("easy-table");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "!Hoover212",
  database: "company_db",
});

const menu = [
  {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Exit",
    ],
  },
];

const start = function () {
  inquirer.prompt(menu).then((answer) => {
    switch (answer.choice) {
      case "View all departments":
        viewAllDepartments();
        console.log("view departments");
        break;
      case "View all roles":
        viewAllRoles();
        console.log("view all roles");
        break;
      case "View all employees":
        viewAllEmployees();
        console.log("view employees");
        break;
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        addRole();
        console.log("add role");
        break;
      case "Add an employee":
        addEmployee();
        console.log("add employee");
        break;
      case "Update an employee role":
        //   updateEmployeeRole();
        console.log("update role");
        break;
      case "Exit":
        console.log("exit");
        process.exit();
        break;
    }
  });
};

function viewAllDepartments() {
  const query = "SELECT * FROM department";

  connection.query(query, (err, results) => {
    if (err) throw err;

    console.table(results);

    // Call the inquirer prompt again to show the menu
    start();
  });
}

function viewAllRoles() {
  const query = "SELECT * FROM role";

  connection.query(query, (err, results) => {
    if (err) throw err;

    console.table(results);

    // Call the inquirer prompt again to show the menu
    start();
  });
}

function viewAllEmployees() {
  const query = "SELECT * FROM employee";

  connection.query(query, (err, results) => {
    if (err) throw err;

    console.table(results);

    // Call the inquirer prompt again to show the menu
    start();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "what is the name of the department?",
      },
    ])
    .then((answer) => {
      const query = "INSERT INTO department (name) VALUES (?)";
      const values = [answer.name];
      connection.query(query, values, (err, result) => {
        if (err) throw err;
        console.log("department added");
        start();
      });
    });
}

function addRole() {
  const query = "SELECT * FROM department";
  connection.query(query, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
          validate: (input) => {
            console.log(typeof input);
            if (isNaN(input)) {
              return "please enter a valid number";
            }
            return true;
          },
        },
        {
          type: "list",
          name: "department",
          message: "Which department does this role belong to?",
          choices: results.map((department) => department.name),
        },
      ])
      .then((answer) => {
        const departmentId = results.find(
          (department) => department.name === answer.department
        ).id;
        const query =
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        const values = [answer.title, answer.salary, departmentId];

        connection.query(query, values, (err, results) => {
          if (err) throw err;

          console.log("Role added successfully!");

          // Call the inquirer prompt again to show the menu
          start();
        });
      });
  });
}

function addEmployee() {
  const query = "SELECT * FROM role";
  connection.query(query, (err, results) => {
    if (err) throw err;

    inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employees first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employees last name?",
      },
    ]);
  });
}

module.exports = {
  start,
};
