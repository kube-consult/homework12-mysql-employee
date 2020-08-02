const Department = require("./department");
const Employee = require("./employee");
const Role = require("./role");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

class Sessions {
    constructor() {
    }
    async go() {

        const { action } = await this.pickType();
        if (action === "Add") {
            console.log("entering Add");
            const { type } = await this.pickTypeDetail();
            if (type.includes('employee')) {
                const employee = new Employee();
                await employee.getEmployee(this.connection);
                await this.loadEmployee();
                this.go();
            } else if (type.includes('department')) {
                const department = new Department();
                await department.getDepartment(this.connection);
                await this.loadDepartments();
                this.go();
            } else if (type.includes('role')) {
                const role = new Role();
                await role.getRole(this.connection);
                await this.loadRoles();
                this.go();
            }
        } else if (action === "View") {
            const { type } = await this.pickTypeDetailView();
            if (type.includes('All Employeees')) {
                console.table(this.empArr);
                this.go();
            } else if (type.includes('All Departments')) {
                console.table(this.depArr);
                this.go();
            } else if (type.includes('All Roles')) {
                console.table(this.rolArr);
                this.go();
            } else if (type.includes('Employee by Manager')) {
                await this.viewManagers();
                this.go();

            } else if (type.includes('Total Salaries')) {
                await this.viewSalary();
                this.go();

            }
        } else if (action === "Update") {
            const { id } = await this.whichId();
            await this.empArr[id].updateValue(this.connection);
            await this.loadEmployee();
            this.go();

        } else if (action === "Delete") {
            const { type } = await this.pickTypeDetail();
            const { id } = await this.whichId();

            if (type.includes('employee')) {
                this.empArr[id].deleteItem(this.connection);
                this.empArr.splice(id, 1);
                await this.loadEmployee();
                this.go();

            } else if (type.includes('department')) {
                this.depArr[id].deleteItem(this.connection);
                this.depArr.splice(id, 1);
                await this.loadDepartments();
                this.go();

            } else if (type.includes('role')) {
                this.rolArr[id].deleteItem(this.connection);
                this.rolArr.splice(id, 1);
                await this.loadRoles();
                this.go();
            }


        } else {
            console.log("Ended");
            process.exit(0);
        }
    }
    async getDetails(nme, msg) {
        return inquirer.prompt([
            {
                type: "input",
                name: nme,
                message: msg
            }
        ])
    }
    async viewManagers(){
        const managerId = (await this.getDetails("managerId","Which manager Id do you want to view by? \n")).managerId;
        const [rows,fields] = await this.connection.query('SELECT * FROM employee where manager_id = ?',[managerId]);
        console.table(rows);
    }
    async viewSalary(){
        const departId = (await this.getDetails("departId","Which department do you want to view \n")).departId;
        const [rows,fields] = await this.connection.query('SELECT b.salary as Salary, c.first as FirstName, c.last as lastName FROM department s INNER JOIN role b ON s.id = b.department_id INNER JOIN employee c ON b.id = c.role_id where s.id = ?',[departId]);
        console.log(rows);
        let total = 0;
        rows.forEach(element => {
            console.log(element.Salary);
            total = (parseInt(total,10) + parseInt(element.Salary,10));
        });
        console.log("total salary = " + total);
    }
    async pickType() {
        return inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Which Action?",
                choices: ["Add", "View", "Update", "Delete"]
            }
        ])
    }
    async pickTypeDetail() {
        return inquirer.prompt([
            {
                type: "list",
                name: "type",
                message: "which Area?",
                choices: ["department", "role", "employeee"]
            }
        ])
    }
    async pickTypeDetailView() {
        return inquirer.prompt([
            {
                type: "list",
                name: "type",
                message: "What do you want to view?",
                choices: ["All Roles", "All Departments", "All Employeees", "Employee by Manager", "Total Salaries"]
            }
        ])
    }
    async whichId() {
        return inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "which row index do you want to alter?"
            }
        ])
    }
    async load() {
        await this.loadEmployee();
        await this.loadRoles();
        await this.loadDepartments();
    }
    async loadRoles() {
        this.rolArr = []
        const [rows, fields] = await this.connection.query('SELECT * FROM role Order by id');
        rows.forEach(element => {
            const role = new Role(element.id, element.title, element.salary, element.department_id);
            this.rolArr.push(role);
        });
    }
    async loadDepartments() {
        this.depArr = []
        const [rows, fields] = await this.connection.query('SELECT * FROM department Order by id');
        rows.forEach(element => {
            const department = new Department(element.id, element.name);
            this.depArr.push(department);
        });
    }
    async loadEmployee() {
        this.empArr = []
        const [rows, fields] = await this.connection.query('SELECT * FROM employee Order by id');
        rows.forEach(element => {
            const employee = new Employee(element.id, element.first, element.last, element.role_id, element.manager_id);
            this.empArr.push(employee);
        });
    }
    async connect() {
        this.connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'homework_DB', password: "Marc9578@@", port: 3306, Promise: bluebird });
        this.load();
        this.go();
    }
}

let session = new Sessions();
session.connect();