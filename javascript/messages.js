"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPECIALCHARS = exports.USERALREADYEXISTS = exports.USERNOTFOUND = exports.GOODBYE = exports.OPTIONERROR = exports.GITHUBAPI = exports.QUERYUSER = exports.QUERYOPTIONS = exports.MAINMENU = void 0;
const MAINMENU = [
    'Get a user from GitHub',
    'Get all stored users',
    'Query users',
    'Quit'
];
exports.MAINMENU = MAINMENU;
const QUERYOPTIONS = [
    'Location',
    'Programming languages'
];
exports.QUERYOPTIONS = QUERYOPTIONS;
const QUERYUSER = '\nType their username: ';
exports.QUERYUSER = QUERYUSER;
const GITHUBAPI = 'https://api.github.com/users/';
exports.GITHUBAPI = GITHUBAPI;
const OPTIONERROR = '\nOption is not valid.\n';
exports.OPTIONERROR = OPTIONERROR;
const GOODBYE = '\nGoodbye!\n';
exports.GOODBYE = GOODBYE;
const USERNOTFOUND = '\nUser not found.\n';
exports.USERNOTFOUND = USERNOTFOUND;
const USERALREADYEXISTS = '\nUser has already been fetched.\n';
exports.USERALREADYEXISTS = USERALREADYEXISTS;
const SPECIALCHARS = 'Github usernames do not contain special characters';
exports.SPECIALCHARS = SPECIALCHARS;
