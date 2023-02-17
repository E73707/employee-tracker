const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const { up } = require("inquirer/lib/utils/readline");

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

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to database: " + err.stack);
//     return;
//   }
//   console.log("Connected to database as id " + connection.threadId);
//   start();
// });

const start = function () {
  inquirer.prompt(menu).then((answer) => {
    switch (answer.choice) {
      case "View all departments":
        viewAllDepartments();
        console.log("view departments");
        break;
      case "View all roles":
        //   viewAllRoles();
        console.log("view all roles");
        break;
      case "View all employees":
        //   viewAllEmployees();
        console.log("view employees");
        break;
      case "Add a department":
        //   addDepartment();
        console.log("add dept");
        break;
      case "Add a role":
        //   addRole();
        console.log("add role");
        break;
      case "Add an employee":
        //   addEmployee();
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

// function viewAllDepartments() {
//   const query = "SELECT * FROM department";

//   connection
//     .promise()
//     .query(query)
//     .then(([rows, fields]) => {
//       console.table(rows);
//     });
// }

function viewAllDepartments() {
  const query = "SELECT * FROM department";

  connection.query(query, (err, results) => {
    if (err) throw err;

    console.table(results);

    // Call the inquirer prompt again to show the menu
    start();
  });
}

// start();

module.exports = {
  start,
};
