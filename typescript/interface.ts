import * as readline from 'readline/promises';

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
Write here: `
  );
  return parseInt(strOption);
}

let getUserText = async (prompt: string): Promise<string> => {
  return await r1.question(prompt);
}

export { r1, getUserNumber, getUserText };