// TODO: Write code to define and export the Employee class
const inquirer = require("inquirer");

class Employee {
    constructor(employeeid,firstname, secondname, roleid, managerid ) {
        this.firstName = firstname;
        this.secondName = secondname;
        this.roleId = roleid;
        this.managerId = managerid;
        this.employeeId = employeeid;
    }
    async getEmployee(connection) {
        this.firstName = (await this.getDetails("firstName", "Employee first name? \n")).firstName;
        this.secondName = (await this.getDetails("secondName", "Employee second name ? \n")).secondName;
        this.roleId = (await this.getDetails("roleId", "Role Id ? \n")).roleId;
        this.managerId = (await this.getDetails("managerId", "Manager Id ?\n")).managerId;
        this.insertItem(connection);
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
        await this.connection.query('SELECT * FROM employee where manager_id = >',[managerId]);
    }
    insertItem(connection) {
        connection.execute('INSERT into employee (first,last,role_id,manager_id) VALUES (?,?,?,?)', [this.firstName,this.secondName,this.roleId,this.managerId]);
        console.log("Successfully added items");
    }
    deleteItem(connection) {
        connection.execute('DELETE from employee where id = ?',[this.employeeId]);
        console.log("Successfully deleted items");
    }
    async updateValue(connection) {
        const updateItem = (await this.getDetails("updateItem", "What do you want to update for employee role or manager? \n")).updateItem;
        const newValue = (await this.getDetails("newValue", "Whats the new value? \n")).newValue;
        if (updateItem.includes('role')) {
            await connection.execute('Update employee set role_id = ? where id = ?', [newValue,this.employeeId]);
        } else {
            await connection.execute('Update employee set manager_id = ? where id = ?', [newValue,this.employeeId]);
        }
    }
}
module.exports = Employee;