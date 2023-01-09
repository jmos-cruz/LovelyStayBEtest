const MENU: Array<string> = [
'Get a user from GitHub',
'Get all stored users',
'Query users',
'Quit'
];

const USERNAMEQUERY: string = '\nType their username: ';

const GITHUBAPI: string = 'https://api.github.com/users/';

const OPTIONERROR: string = '\nOption is not valid.\n';

const GOODBYE: string = '\nGoodbye!\n';

const USERNOTFOUND: string = '\nUser not found.\n'

export { 
  MENU, 
  USERNAMEQUERY, 
  GITHUBAPI, 
  OPTIONERROR, 
  GOODBYE,
  USERNOTFOUND
};