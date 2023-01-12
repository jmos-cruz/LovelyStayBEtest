const MAINMENU: Array<string> = [
'Get a user from GitHub',
'Get all stored users',
'Query users',
'Quit'
];

const QUERYOPTIONS: Array<string> = [
  'Location', 
  'Programming languages'
];

const QUERYUSER: string = '\nType their username: ';

const GITHUBAPI: string = 'https://api.github.com/users/';

const OPTIONERROR: string = '\nOption is not valid.\n';

const GOODBYE: string = '\nGoodbye!\n';

const USERNOTFOUND: string = '\nUser not found.\n';

const USERALREADYEXISTS: string = '\nUser has already been fetched.\n';

const SPECIALCHARS:string='Github usernames do not contain special characters';

export { 
  MAINMENU,
  QUERYOPTIONS,
  QUERYUSER, 
  GITHUBAPI, 
  OPTIONERROR, 
  GOODBYE,
  USERNOTFOUND,
  USERALREADYEXISTS,
  SPECIALCHARS
};