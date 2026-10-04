import { User } from "./User.js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { json } from "node:stream/consumers";
import fs from "fs";


const user1 = new User(22334, "Michael", 1234, 2500);
const user2 = new User(1, "Steven", 1234, 3000);
const userList = [user1, user2]

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
            exit(user);
            break;
        default: 
            console.log("This is not an option!");
            await UseATM(user, rl);
            }
        }

async function withdraw(user, rl){
    const amount = await rl.question("How much do you want to withdraw (max. " + user.balance + "$): ")
    while (amount > user.balance || amount < 1  || amount > atmBalance()){
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

async function exit(user){
    console.log("Bye, " + user.name+ ".");
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.clear();
    main(user);
}
        
async function login(user, rl) {
    const userIdInput = await rl.question("Please enter ID: ");
        for(user of userList) {
            if(userIdInput == user.id){
                let i = 3;
                while(i>0){
                    const userPinInput = await rl.question("Enter your PIN ... ");
                    if(user.pin == userPinInput){
                        return user;
                    }else 
                        i--;
                        console.log("Wrong Pin! You have " + i + " tries left.")
                }
            }

        }
        console.log("Wrong ID or Pin!") 
        await login(user, rl); 
        return user;          
}

function atmBalance(){
    const JsonData = JSON.parse(fs.readFileSync("./ATM.json", "utf-8"));
    return JsonData.balance;
}

async function main(user) {
    const rl = readline.createInterface({ input, output });
    console.log("Welcome");
    user = await login(user, rl);
    console.log("Hello, " + user.name + ".");
    console.log("Your balance is: " + user.balance + "$");

    await UseATM(user, rl);
}

main();