import { users } from "./User.js";
import { User } from "./User.js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import fs from "fs";


async function UseATM(user, rl) {
    const cInput = await rl.question("Choose: withdraw, deposite, exit: ");
    switch(cInput){
        case "withdraw": 
            withdraw(user, rl);
            break;
        case "deposite": 
            deposite(user, rl);
            break;
        case "exit": 
            exit(user, rl);
            break;
        default:
            console.log("This is not an option!");
            await UseATM(user, rl);
            }
        }

async function withdraw(user, rl){
    const amount = Number( await rl.question("How much do you want to withdraw (max. " + user.balance + "$): "));
    while (amount > user.balance || amount < 1  || amount > atmBalance()){
        if(amount > atmBalance()){
            console.log("Error: The ATM has not enough exchange inside! (max: " + atmBalance() + "$).");
            return deposite(user, rl);    
        }else
            console.log("Not possible!");
            return withdraw(user, rl);
    }
    user.balance = user.balance - amount;
    console.log("Withdrew: " + amount + "$. Your new balance is: " + user.balance +"$");
    console.log("Returning to Menu...");
    UseATM(user, rl);  
}

async function deposite(user, rl){
    const amount = Number(await rl.question("How much do you want to deposite(max. 2000$): "))
    while (amount >= 2000 || amount <= 1){
        console.log("Not possible!");
        return deposite(user, rl);
    }
    user.balance += amount;
    console.log("Deposited: " + amount + "$. Your new balance is: " + user.balance +"$");
    console.log("Returning to Menu...");
    UseATM(user, rl);
}

async function exit(user, rl){
    console.log("Bye, " + user.name+ ".");
    await new Promise(resolve => setTimeout(resolve, 3000));
    rl.close();
    console.clear();    
    main(user);
}
        
async function login(rl) {
    const users = JSON.parse(
        fs.readFileSync("./User.json", "utf-8")
    );
    let userIdInput = Number(await rl.question("Please enter ID: "));
    let user = users.find(user => user.id === userIdInput);
    while(user == undefined){
        console.log("Wrong ID or Pin!")
        userIdInput = Number(await rl.question("Please enter ID: "));
        user = users.find(user => user.id === userIdInput);
    }
    let i = 3;
    while(i>0){
        const userPinInput = Number(await rl.question("Enter your PIN .... "));
        if(user.pin == userPinInput){
            return user;
        }else 
            i--;
            console.log("Wrong Pin! You have " + i + " tries left.")
    }
             
}

async function register(rl){
    const jsonUsers = JSON.parse(
        fs.readFileSync("./User.json", "utf-8")
    );
    let id = 100000;
    let user = null;
    do{
       id += 1;
       user = users.find(user => user.id === id);
       }while(user != undefined);
    const name = await rl.question("Please enter your name: ");
    const pin = pinGen();
    const balance = 10;
    const newuser = new User(id, name, pin, balance);
    jsonUsers.push(newuser);
    fs.writeFileSync(
        "./User.json",
        JSON.stringify(jsonUsers, null, 2)
    );
    console.clear();
    return newuser;
}

function pinGen(){
    let newpin = Math.floor(Math.random()*9999) + 1000;
    let user = users.find(user => user.pin === newpin);
    if (user == undefined){
        return newpin;
    }else pinGen();
}
      
function atmBalance(){
    const JsonData = JSON.parse(fs.readFileSync("./ATM.json", "utf-8"));
    return JsonData.balance;
}

async function main(user) {
    const rl = readline.createInterface({ input, output });
    console.log("Welcome");
    let answer = null; 
    do {
        answer = await rl.question("Choose: login or register: ");
           if (answer !== "login" && answer !== "register") {
            console.log("Wrong input!");
            }
    }while (answer !== "login" && answer !== "register");
        if(answer == "login"){
            user = await login(rl);
        }else
            user = await register(rl);
    console.log("Hello, " + user.name + ".");
    console.log("Your balance is: " + user.balance + "$");

    await UseATM(user, rl);
}

main();