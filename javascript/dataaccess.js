"use strict";
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
exports.getUsersByLocation = exports.getAllLocations = exports.getAllUsers = exports.insertUser = exports.pgp = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = (0, pg_promise_1.default)();
exports.pgp = pgp;
const connect = {
    host: 'localhost',
    port: 5432,
    database: 'github_users',
    user: 'joao',
    password: 'pato',
    max: 30
};
const db = pgp(connect);
//Have to check first if the user already 
//exists or not before adding to DB
let insertUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let insertion = yield db.any('INSERT INTO users VALUES ($1, $2, $3, $4)', [user.id, user.login, user.name, user.location]);
});
exports.insertUser = insertUser;
let getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield db.any('SELECT * FROM users');
    return users;
});
exports.getAllUsers = getAllUsers;
let getAllLocations = () => __awaiter(void 0, void 0, void 0, function* () {
    let location = yield db.any('SELECT location FROM users');
    return location.map(obj => obj = obj.location);
});
exports.getAllLocations = getAllLocations;
let getUsersByLocation = (location) => __awaiter(void 0, void 0, void 0, function* () {
    let query = 'SELECT * FROM users WHERE location ';
    if (location === 'null') {
        return yield db.any(query + 'IS NULL');
    }
    else {
        return yield db.any(query + '= $1', location);
    }
});
exports.getUsersByLocation = getUsersByLocation;
