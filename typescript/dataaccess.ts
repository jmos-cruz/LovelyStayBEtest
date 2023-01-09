import pgPromise from 'pg-promise';

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

type User = {
  id: number,
  login: string,
  name: string | null,
  location: string | null
}

//Have to check first if the user already 
//exists or not before adding to DB
let insertUser = async (user: User): Promise<void> => {
  let insertion: any = await db.any(
    'INSERT INTO users VALUES ($1, $2, $3, $4)',
    [user.id, user.login, user.name, user.location]
  );
}

let getAllUsers = async (): Promise<Array<User>> => {
  let users: Array<User> = await db.any('SELECT * FROM users');
  return users;
}

let getAllLocations = async (): Promise<Array<string>> => {
  let location: Array<any> = await db.any('SELECT location FROM users');
  return location.map(obj => obj = obj.location);
}

let getUsersByLocation = async (location: string) => {
  let query: string = 'SELECT * FROM users WHERE location ';
  if(location === 'null') {
    return await db.any(query + 'IS NULL');
  } else {
    return await db.any(query + '= $1', location);
  }
}

export {pgp, User, insertUser, getAllUsers, getAllLocations, getUsersByLocation };