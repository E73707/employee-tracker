INSERT INTO department(name)
VALUES
    ("Engineering"),
    ("Finance"),
    ("Legal"),
    ("Sales");


INSERT INTO role(title, salary, departmentID)
VALUES
    ('senior engineer', 100000, 1);


INSERT INTO employee(firstName, lastName, roleID, managerId)
VALUES
("Edward", 'Vaughan', 7, NULL);