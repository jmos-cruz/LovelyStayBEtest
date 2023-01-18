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
exports.getUserByUsername = exports.getUsersByLanguage = exports.getUsersByLctn = exports.getAllLanguages = exports.getAllLocations = exports.getAllUsers = exports.insertUser = exports.pgp = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const daoQueries_1 = __importDefault(require("./daoQueries"));
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
//Adds user to a table and the corresponding
//languages to another table
let insertUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield db.any(daoQueries_1.default.insert + '($2, $3, $4, $5)', ['users', user.id, user.username, user.fullname, user.location]);
    yield Promise.all(user.languages.map((language) => __awaiter(void 0, void 0, void 0, function* () {
        yield db.any(daoQueries_1.default.insert + '($2, $3)', ['user_languages', user.id, language]);
    })));
});
exports.insertUser = insertUser;
let getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    let query = daoQueries_1.default.selectLeftJoin;
    let users = yield db.any(query, '*');
    return users;
});
exports.getAllUsers = getAllUsers;
let getAllLocations = () => __awaiter(void 0, void 0, void 0, function* () {
    let locations = yield db.any(daoQueries_1.default.selectDistinct, ['location', 'users']);
    return Object.values(locations);
});
exports.getAllLocations = getAllLocations;
let getAllLanguages = () => __awaiter(void 0, void 0, void 0, function* () {
    let languages = yield db.any(daoQueries_1.default.selectDistinct, ['programming_language', 'user_languages']);
    return Object.values(languages);
});
exports.getAllLanguages = getAllLanguages;
let getUsersByLctn = (location) => __awaiter(void 0, void 0, void 0, function* () {
    let query = daoQueries_1.default.selectLeftJoin + ' WHERE location ';
    query += location === 'IS NULL' ? 'IS NULL' : '= $2';
    return yield db.any(query, ['*', location]);
});
exports.getUsersByLctn = getUsersByLctn;
//Returns ': Promise<Array<Array<DaoUser>>>'
//Adding this exceeds the 80 characters limit per line
let getUsersByLanguage = (language) => __awaiter(void 0, void 0, void 0, function* () {
    let queryIds = daoQueries_1.default.selectLeftJoin + ' WHERE ';
    let userIds = yield db.any(queryIds + 'ul.programming_language = $2', ['*', language]);
    userIds = userIds.map(obj => obj = obj.id);
    return yield Promise.all(userIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queryIds + 'u.id = $2', ['*', id]);
    })));
});
exports.getUsersByLanguage = getUsersByLanguage;
//Function only used to verify if the user already exists
//in the database. No need to obtain their languages
let getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield db.any('SELECT * FROM users WHERE username = $1', username);
    return user[0];
});
exports.getUserByUsername = getUserByUsername;
