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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline-sync"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = (0, pg_promise_1.default)();
const connect = {
    host: 'localhost',
    port: 5432,
    database: 'github_users',
    user: 'joao',
    password: 'pato',
    max: 30
};
const db = pgp(connect);
console.log(db);
let main = () => __awaiter(void 0, void 0, void 0, function* () {
    switch (getUserInput()) {
        case 1:
            let username = readline.question('\nType their username: ');
            let user = yield fetchUsers(username);
            if (user) {
                yield insertUser(user);
            }
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            console.log('\nGoodbye!\n');
            return;
        default:
            console.log('\nOption is not valid. Please try again.\n');
            break;
    }
    main();
});
let fetchUsers = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://api.github.com/users/${username}`);
    const fetchedUser = yield response.json();
    if (fetchedUser.message) {
        console.log("User not found");
        return;
    }
    const user = {
        id: fetchedUser.id,
        login: fetchedUser.login,
        name: fetchedUser.name,
        location: fetchedUser.location
    };
    return user;
});
let getUserInput = () => {
    let strOption = readline.question(`Choose an option:
    1 - Get a user from GitHub
    2 - Get all stored users
    3 - Query users
    4 - Quit
    `);
    return parseInt(strOption);
};
let insertUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield db.any('INSERT INTO users VALUES ($1, $2, $3, $4)', [user.id, user.login, user.name, user.location]);
});
main();
