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
//Utilitary file containing only messages
//for the command-line
const messages = __importStar(require("./messages"));
//Data access object file with database access functions
const dao = __importStar(require("./dataaccess"));
//Interface file with user prompts
const userGui = __importStar(require("./interface"));
/*
The main function of the application
Functions as both the command-line interface and
the app controller
*/
let main = () => __awaiter(void 0, void 0, void 0, function* () {
    let option = yield userGui.getUserNumber(messages.MENU);
    switch (option) {
        //Prompts the user for a GitHub username
        //and stores it in the database, if found
        case 1:
            let username = yield userGui.getUserText(messages.USERNAMEQUERY);
            let user = yield fetchUser(username);
            if (user.id === -1) {
                console.log(messages.USERNOTFOUND);
                break;
            }
            //Have to return a value here to check if an error occurred
            yield dao.insertUser(user);
            break;
        //Returns all stored users
        case 2:
            console.log(yield dao.getAllUsers());
            break;
        //Returns a list of users by location or programming language
        case 3:
            let locations = yield dao.getAllLocations();
            let locationOptions = locations.filter((item, pos) => {
                return locations.indexOf(item) == pos;
            });
            locationOptions = locationOptions.map(string => string == null ? 'null' : string);
            let queryOption = yield userGui.getUserNumber(locationOptions);
            let locationSelected = locationOptions[queryOption - 1];
            if (locationSelected) {
                console.log(yield dao.getUsersByLocation(locationSelected));
            }
            else {
                console.log(messages.OPTIONERROR);
            }
            break;
        //Quits the application
        case 4:
            console.log(messages.GOODBYE);
            userGui.r1.close();
            dao.pgp.end();
            return;
        //In case option typed is either NaN or non-existing
        default:
            console.log(messages.OPTIONERROR);
            break;
    }
    //Recursive call to main function
    main();
});
//Fetches a GitHub user from the GitHub API
let fetchUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(messages.GITHUBAPI + username);
    const fetchedUser = yield response.json();
    //Fetching a non-existing user returns an object with
    //a message property, which is not present
    //in an existing user object
    if (fetchedUser.message) {
        return {
            id: -1,
            login: '',
            name: null,
            location: null
        };
    }
    return {
        id: fetchedUser.id,
        login: fetchedUser.login,
        name: fetchedUser.name,
        location: fetchedUser.location
    };
});
//The entry point of the application
main();
