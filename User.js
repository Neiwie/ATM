import fs from "fs";
import { findPackageJSON } from "module";


export class User {

    constructor (id, name, pin, balance){
        this.id = id;
        this.name = name;
        this.pin = pin;
        this.balance = Number(balance);
    }
        
}

const jsonUsers = JSON.parse(fs.readFileSync("./User.json", "utf-8"));
export const users = jsonUsers.map(
    user => new User(user.id, user.name, user.pin, user.balance)
);


