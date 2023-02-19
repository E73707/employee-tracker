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
        updateEmployeeRole();
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
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id`;

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
  const roleQuery = "SELECT * FROM role";
  const employeeQuery = "SELECT * FROM employee";

  Promise.all([
    connection.promise().query(roleQuery),
    connection.promise().query(employeeQuery),
  ])
    .then(([roles, employees]) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roles[0].map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: [
              { name: "None", value: null },
              ...employees[0].map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              })),
            ],
          },
        ])
        .then((answer) => {
          const query =
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
          const values = [
            answer.firstName,
            answer.lastName,
            answer.roleId,
            answer.managerId,
          ];

          connection.query(query, values, (err, results) => {
            if (err) throw err;

            console.log("Employee added successfully!");

            // Call the inquirer prompt again to show the menu
            start();
          });
        });
    })
    .catch((err) => console.error(err));
}

function updateEmployeeRole() {
  const roleQuery = "SELECT * FROM role";
  const employeeQuery = "SELECT * FROM employee";
  Promise.all([
    connection.promise().query(roleQuery),
    connection.promise().query(employeeQuery),
  ]).then(([roles, employees]) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "updateEmployee",
          message: "Choose an employee who's role you would like to update",
          choices: [
            ...employees[0].map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          ],
        },
        {
          type: "list",
          name: "updateRole",
          message: "Choose the employee's new role",
          choices: [
            ...roles[0].map((role) => ({
              name: role.title,
              value: role.id,
            })),
          ],
        },
      ])
      .then((answer) => {
        const updateQuery = "UPDATE employee SET role_id = ? WHERE id = ?";
        connection.query(
          updateQuery,
          [answer.updateRole, answer.updateEmployee],
          (err, results) => {
            if (err) throw err;

            console.log("Employee role updated successfully!");

            // Call the inquirer prompt again to show the menu
            start();
          }
        );
      });
  });
}

module.exports = {
  start,
};
