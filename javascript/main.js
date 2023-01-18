"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//Utilitarys files containing only messages
//for the command-line
//and a type
const messages = __importStar(require("./messages"));
//UI file with user prompts
const userGui = __importStar(require("./userInterface"));
//Controller file to connect with database
const controller = __importStar(require("./controller"));
/*
The main function of the application
Functions as both the command-line interface and
the app controller
*/
let main = () => __awaiter(void 0, void 0, void 0, function* () {
    let option = yield userGui.getUserNumber(messages.MAINMENU);
    switch (option) {
        //Prompts the user for a GitHub username
        //and stores it in the database, if found
        case 1:
            const format = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
            let username;
            username = yield userGui.getUserText(messages.QUERYUSER);
            //Checks if the username has any special characters
            if (format.test(username)) {
                console.log('\n' + messages.SPECIALCHARS + '\n');
                break;
            }
            //Checks if the user already exists in the database
            if (yield controller.checkIfUserInDb(username)) {
                console.log(messages.USERALREADYEXISTS);
                break;
            }
            let user = yield controller.fetchUserFromApi(username);
            //Checks if user exists on Github
            if (user.id === -1) {
                console.log(messages.USERNOTFOUND);
                break;
            }
            controller.insertUserInDb(user);
            userGui.printUser(user);
            break;
        //Returns all stored users
        case 2:
            let allStoredUsers;
            allStoredUsers = yield controller.getAllUsersFromDb();
            organizeStoredUsers(allStoredUsers)
                .forEach(user => userGui.printUser(user));
            break;
        //Prompts user to fetch users by location or by programming language
        case 3:
            let queryOption;
            queryOption = yield userGui.getUserNumber(messages.QUERYOPTIONS);
            switch (queryOption) {
                case 1:
                    let locations;
                    locations = yield controller.getAllLocationsFromDb();
                    let queryLctnOption;
                    queryLctnOption = yield userGui.getUserNumber(locations);
                    let lctn = locations[queryLctnOption - 1];
                    //Returns to main menu if option is either
                    //NaN or not valid
                    if (!lctn) {
                        console.log(messages.OPTIONERROR);
                        break;
                    }
                    let queriedUsersLctn;
                    queriedUsersLctn = yield controller.queryUsersByLctn(lctn);
                    organizeStoredUsers(queriedUsersLctn).
                        forEach(user => userGui.printUser(user));
                    break;
                case 2:
                    let languages;
                    languages = yield controller.getAllLanguagesFromDb();
                    let queryLanguageOption;
                    queryLanguageOption = yield userGui.getUserNumber(languages);
                    let language = languages[queryLanguageOption - 1];
                    if (!language) {
                        console.log(messages.OPTIONERROR);
                        break;
                    }
                    let queriedUsersLang;
                    queriedUsersLang = yield controller.queryUsersByLang(language);
                    console.log(queriedUsersLang);
                    queriedUsersLang.forEach(userArr => {
                        organizeStoredUsers(userArr).
                            forEach(user => userGui.printUser(user));
                    });
                    break;
                default:
                    console.log(messages.OPTIONERROR);
            }
            break;
        //Quits the application
        case 4:
            console.log(messages.GOODBYE);
            controller.close();
            return;
        //In case option typed is either NaN or non-existing
        default:
            console.log(messages.OPTIONERROR);
    }
    //Recursive call
    main();
});
let organizeStoredUsers = (users) => {
    let distinctUsers = new Array;
    users.forEach(user => {
        let userExists;
        userExists = distinctUsers.filter(newUser => newUser.username === user.username);
        if (!userExists[0]) {
            distinctUsers.push({
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                location: user.location,
                languages: [user.programming_language]
            });
        }
        else {
            distinctUsers.map(newUser => {
                if (newUser.username === user.username) {
                    newUser.languages.push(user.programming_language);
                }
            });
        }
    });
    return distinctUsers;
};
//The entry point of the application
main();
