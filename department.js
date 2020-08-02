// TODO: Write code to define and export the Employee class
const inquirer = require("inquirer");

class Department  {
    constructor(id,name) {
        this.name = name;
        this.departmentId = id;
    }
    async getDepartment(connection) {
        this.name = (await this.getDetails("name", "Department name? \n")).name;
        await this.insertItem(connection);
    }
    async getDetails(nme,msg) {
        return inquirer.prompt([
            {
                type: "input",
                name: nme,
                message: msg
            }
        ])
    }
    insertItem(connection) {
        connection.execute('INSERT into department (name) VALUES (?)', [this.name]);
        console.log("Successfully added items");
    }
    deleteItem(connection) {
        connection.execute('DELETE from department where id = ?',[this.departmentId]);
        console.log("Successfully deleted items ",this.departmentId);
    }}
module.exports = Department;