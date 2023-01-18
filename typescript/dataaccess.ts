import pgPromise from 'pg-promise';

import User from './userTypes';
import { DaoUser } from './userTypes';

import daoQueries from './daoQueries';

const pgp: any = pgPromise();
const connect: any = {
  host: 'localhost',
  port: 5432,
  database: 'github_users',
  user: 'joao',
  password: 'pato',
  max: 30
};
const db: any = pgp(connect);

//Adds user to a table and the corresponding
//languages to another table
let insertUser = async (user: User): Promise<void> => {
  await db.any(
    daoQueries.insert + '($2, $3, $4, $5)', 
    ['users', user.id, user.username, user.fullname, user.location]
  );

  await Promise.all(user.languages.map(async language => {
    await db.any(daoQueries.insert + '($2, $3)',
      ['user_languages', user.id, language]
    );
  }))
}

let getAllUsers = async (): Promise<Array<DaoUser>> => {
  let query: string = daoQueries.selectLeftJoin;
  let users: Array<DaoUser> = await db.any(query, '*');
  return users;
}

let getAllLocations = async (): Promise<Array<string>> => {
  let locations: Array<any> = await db.any(
    daoQueries.selectDistinct, ['location', 'users']
    );
  return Object.values(locations);
}

let getAllLanguages = async (): Promise<Array<string>> => {
  let languages: Array<any> = await db.any(
    daoQueries.selectDistinct, ['programming_language', 'user_languages']
  );
  return Object.values(languages);
}

let getUsersByLctn = async (location: string): Promise<Array<DaoUser>> => {
  let query: string = daoQueries.selectLeftJoin + ' WHERE location ';
  query += location === 'IS NULL' ? 'IS NULL' : '= $2';
  return await db.any(query, ['*', location]);
}

//Returns ': Promise<Array<Array<DaoUser>>>'
//Adding this exceeds the 80 characters limit per line
let getUsersByLanguage = async (language: string) => {
  let queryIds: string = daoQueries.selectLeftJoin + ' WHERE ';

  let userIds: Array<any> = await db.any(
    queryIds + 'ul.programming_language = $2', ['*', language]
  );

  userIds = userIds.map(obj => obj = obj.id);

  return await Promise.all(userIds.map(async id => {
    return await db.any(queryIds + 'u.id = $2', ['*', id]);
  }))
}

//Function only used to verify if the user already exists
//in the database. No need to obtain their languages
let getUserByUsername = async (username: string): Promise<User> => {
  let user: Array<User> = await db.any(
    'SELECT * FROM users WHERE username = $1',  username
  );
  return user[0];
}

export {
  pgp, insertUser,
  getAllUsers,
  getAllLocations,
  getAllLanguages,
  getUsersByLctn,
  getUsersByLanguage,
  getUserByUsername
};