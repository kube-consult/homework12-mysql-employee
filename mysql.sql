DROP DATABASE IF EXISTS homework_DB;
CREATE database homework_DB;

USE homework_DB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first VARCHAR(30) NULL,
  last VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,4) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO role (id,title,salary,department_id)
VALUES (1,"engineer",300000,1);

INSERT INTO department (id,name)
VALUES (1,"IT");

INSERT INTO department (id,name)
VALUES (2,"Admin");

INSERT INTO employee (id,first,last,role_id,manager_id)
VALUES (1,"paul","Foster",1,1);


