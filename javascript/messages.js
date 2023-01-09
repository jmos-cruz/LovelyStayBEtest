"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERNOTFOUND = exports.GOODBYE = exports.OPTIONERROR = exports.GITHUBAPI = exports.USERNAMEQUERY = exports.MENU = void 0;
const MENU = [
    'Get a user from GitHub',
    'Get all stored users',
    'Query users',
    'Quit'
];
exports.MENU = MENU;
const USERNAMEQUERY = '\nType their username: ';
exports.USERNAMEQUERY = USERNAMEQUERY;
const GITHUBAPI = 'https://api.github.com/users/';
exports.GITHUBAPI = GITHUBAPI;
const OPTIONERROR = '\nOption is not valid.\n';
exports.OPTIONERROR = OPTIONERROR;
const GOODBYE = '\nGoodbye!\n';
exports.GOODBYE = GOODBYE;
const USERNOTFOUND = '\nUser not found.\n';
exports.USERNOTFOUND = USERNOTFOUND;
