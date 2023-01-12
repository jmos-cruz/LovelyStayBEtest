import * as readline from 'readline/promises';

import User from './userTypes';

const r1: any = readline.createInterface({
  input: process.stdin, 
  output: process.stdout
});

let getUserNumber = async (arr: Array<any>): Promise<number> => {
  let options: Array<string> = arr.map(
    (string, index) => string = (index + 1) + ' - ' + string
  );
  let strOption: string = await r1.question(
`Choose an option:
${options.join('\n')}
>> `
  );
  return parseInt(strOption);
}

let getUserText = async (prompt: string): Promise<string> => {
  return await r1.question(prompt);
}

let printUser = (user: User): void => {
  //Languages requires two things:
  //1-check if user has no languages
  //2-separate more pretty
  console.log(`
Username: ${user.username};
Full name: ${user.fullname};
Location: ${user.location};
Languages: ${user.languages}
`);
}

export { 
  r1, 
  getUserNumber, 
  getUserText,
  printUser
};