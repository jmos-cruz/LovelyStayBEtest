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
exports.close = exports.fetchUserFromApi = exports.queryUsersByLang = exports.queryUsersByLctn = exports.getAllLanguagesFromDb = exports.getAllLocationsFromDb = exports.getAllUsersFromDb = exports.insertUserInDb = exports.checkIfUserInDb = void 0;
//Utilitary file containing only messages
//for the command-line
const messages = __importStar(require("./messages"));
//Data access object file with database access functions
const dao = __importStar(require("./dataaccess"));
const userTypes_1 = require("./userTypes");
//Interface file with user prompts
const userInterface_1 = require("./userInterface");
//Validate if user exists in the database
let checkIfUserInDb = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield dao.getUserByUsername(username)) ? true : false;
});
exports.checkIfUserInDb = checkIfUserInDb;
//Prompts user to select a location that exists
//in the database and fetch all users that share 
//the selected location
let queryUsersByLctn = (location) => __awaiter(void 0, void 0, void 0, function* () {
    //Returns all users that share the same location
    location = location === 'null' ? 'IS NULL' : location;
    return yield dao.getUsersByLctn(location);
});
exports.queryUsersByLctn = queryUsersByLctn;
//Returns ': Promise<Array<Array<DaoUser>>>'
//Adding this exceeds the 80 characters limit
let queryUsersByLang = (language) => __awaiter(void 0, void 0, void 0, function* () {
    return yield dao.getUsersByLanguage(language);
});
exports.queryUsersByLang = queryUsersByLang;
let insertUserInDb = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield dao.insertUser(user);
});
exports.insertUserInDb = insertUserInDb;
let getAllUsersFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield dao.getAllUsers();
});
exports.getAllUsersFromDb = getAllUsersFromDb;
//Obtains all locations stored in the database
//to use for user prompt
let getAllLocationsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    let locationObjs = yield dao.getAllLocations();
    let locations;
    locations = locationObjs.map(obj => obj = obj.location);
    return locations.map(string => string == null ? 'null' : string);
});
exports.getAllLocationsFromDb = getAllLocationsFromDb;
let getAllLanguagesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    let languageObjs = yield dao.getAllLanguages();
    let languages;
    languages = languageObjs.map(obj => obj = obj.programming_language);
    return languages.map(string => string == null ? 'null' : string);
});
exports.getAllLanguagesFromDb = getAllLanguagesFromDb;
//Fetches a GitHub user from the GitHub API
let fetchUserFromApi = (username) => __awaiter(void 0, void 0, void 0, function* () {
    let fetchedUser;
    fetchedUser = yield fetchFromApi(messages.GITHUBAPI + username);
    //Fetching a non-existing user returns an object with
    //a message property, which is not present
    //in an existing user object
    if (fetchedUser.message) {
        return userTypes_1.emptyUser;
    }
    let user = {
        id: fetchedUser.id,
        username: fetchedUser.login,
        fullname: fetchedUser.name,
        location: fetchedUser.location,
        languages: new Array
    };
    let reposLinks = yield fetchUserRepos(user);
    yield Promise.all(reposLinks.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        let repoLanguages;
        repoLanguages = Object.keys(yield fetchFromApi(url));
        repoLanguages.forEach(language => {
            if (!user.languages.includes(language)) {
                user.languages.push(language);
            }
        });
    })));
    return user;
});
exports.fetchUserFromApi = fetchUserFromApi;
let fetchUserRepos = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let userReposApi;
    userReposApi = messages.GITHUBAPI + user.username + "/repos";
    const userRepos = yield fetchFromApi(userReposApi);
    return userRepos.map(repos => { return repos.languages_url; });
});
let fetchFromApi = (link) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(link);
    return yield response.json();
});
let close = () => {
    userInterface_1.r1.close();
    dao.pgp.end();
};
exports.close = close;
