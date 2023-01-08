import * as readline from 'readline-sync';
import pgPromise from 'pg-promise';

const pgp = pgPromise();
const connect = {
  host: 'localhost',
  port: 5432,
  database: 'github_users',
  user: 'joao',
  password: 'pato',
  max: 30
};
const db = pgp(connect);

type User = {
  id: number,
  login: string,
  name: string,
  location: string
}

let main = async () => {
  switch(getUserInput()) {
    case 1:
      let username = readline.question('\nType their username: ')
      let user = await fetchUsers(username);
      if(user) {
        await insertUser(user);
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
}

let fetchUsers = async (username: string) => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const fetchedUser = await response.json();

  if(fetchedUser.message) {
    console.log("User not found");
    return;
  }

  const user: User = {
    id: fetchedUser.id,
    login: fetchedUser.login,
    name: fetchedUser.name,
    location: fetchedUser.location
  }

  return user;
}

let getUserInput = (): number => {
  let strOption: string = readline.question(
    `Choose an option:
    1 - Get a user from GitHub
    2 - Get all stored users
    3 - Query users
    4 - Quit
    `
  );
  return parseInt(strOption);
}

let insertUser = async (user: User) => {
  await db.any('INSERT INTO users VALUES ($1, $2, $3, $4)',
  [user.id, user.login, user.name, user.location]);
}

main();