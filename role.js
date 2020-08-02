// TODO: Write code to define and export the Employee class
const inquirer = require("inquirer");
class Role  {
    constructor(id,title,salary,department_id) {
        this.title = title;
        this.salary = salary;
        this.roleId = id;
        this.departmentId = department_id;
    }
    async getRole(connection) {
        this.title = (await this.getDetails("title", "Title? \n")).title;
        this.salary = (await this.getDetails("salary","Salary\n")).salary; 
        this.departmentId = (await this.getDetails("departmentId","Department Id\n")).departmentId; 
        this.insertItem(connection);
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
        connection.execute('INSERT into role (title,salary,department_id) VALUES (?,?,?)', [this.title,this.salary,this.departmentId]);
        console.log("Successfully added items");
    }
    deleteItem(connection) {
        connection.execute('DELETE from role where id ?',[this.roleId]);
        console.log("Successfully deleted items");
    }
}
module.exports = Role;