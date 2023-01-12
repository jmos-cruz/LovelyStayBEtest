//Utilitarys files containing only messages
//for the command-line
//and a type
import *  as messages from './messages'; 
import User from './userTypes';
import { DaoUser } from './userTypes';

//UI file with user prompts
import * as userGui from './userInterface';

//Controller file to connect with database
import * as controller from './controller';

/*
The main function of the application
Functions as both the command-line interface and 
the app controller
*/
let main = async (): Promise<void> => {

  let option: number = await userGui.getUserNumber(messages.MAINMENU);

  switch(option) {
    //Prompts the user for a GitHub username
    //and stores it in the database, if found
    case 1:
      const format = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;

      let username: string;
      username = await userGui.getUserText(messages.QUERYUSER);

      //Checks if the username has any special characters
      if(format.test(username)) {
        console.log('\n' + messages.SPECIALCHARS + '\n');
        break;
      }

      //Checks if the user already exists in the database
      if(await controller.checkIfUserInDb(username)) {
        console.log(messages.USERALREADYEXISTS);
        break;
      }

      let user: User = await controller.fetchUserFromApi(username);

      //Checks if user exists on Github
      if(user.id === -1) {
        console.log(messages.USERNOTFOUND);
        break;
      }

      controller.insertUserInDb(user);
      userGui.printUser(user);

      break;

    //Returns all stored users
    case 2:

      let allStoredUsers: Array<DaoUser>;
      allStoredUsers = await controller.getAllUsersFromDb();

      organizeStoredUsers(allStoredUsers)
      .forEach(user => userGui.printUser(user));

      break;

    //Prompts user to fetch users by location or by programming language
    case 3:
      let queryOption: number;
      queryOption = await userGui.getUserNumber(messages.QUERYOPTIONS);



      switch(queryOption) {
        case 1:
          let locations: Array<string>;
          locations = await controller.getAllLocationsFromDb();

          let queryLctnOption: number;
          queryLctnOption = await userGui.getUserNumber(locations);

          let lctn: string = locations[queryLctnOption-1];

          //Returns to main menu if option is either
          //NaN or not valid
          if(!lctn) {
            console.log(messages.OPTIONERROR);
            break;
          }

          let queriedUsersLctn: Array<DaoUser>;
          queriedUsersLctn = await controller.queryUsersByLctn(lctn);

          organizeStoredUsers(queriedUsersLctn).
          forEach(user => userGui.printUser(user));

         break;

        case 2:
          let languages: Array<string>;
          languages = await controller.getAllLanguagesFromDb();

          let queryLanguageOption: number;
          queryLanguageOption = await userGui.getUserNumber(languages);

          let language: string = languages[queryLanguageOption-1];

          if(!language){
            console.log(messages.OPTIONERROR);
            break;
          }

          let queriedUsersLang: Array<Array<DaoUser>>;
          queriedUsersLang = await controller.queryUsersByLang(language);

          queriedUsersLang.forEach(userArr => {
            organizeStoredUsers(userArr).
            forEach(user => userGui.printUser(user));
          });

          break;
        default:
          console.log(messages.OPTIONERROR);
      }

      break;

    //Quits the application
    case 4:
      console.log(messages.GOODBYE);
      controller.close();
      return;

    //In case option typed is either NaN or non-existing
    default:
      console.log(messages.OPTIONERROR);
    }

  //Recursive call
  main();

}

let organizeStoredUsers = (users: Array<DaoUser>): Array<User> => {
  let distinctUsers: Array<User> = new Array<User>;
  users.forEach(user => {
    let userExists: Array<User>;
    userExists = distinctUsers.filter(
      newUser => newUser.username === user.username
    );
    
    if (!userExists[0]) {

      distinctUsers.push({
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        location: user.location,
        languages: [user.programming_language]
      });

    } else {
      distinctUsers.map(newUser => {
        if (newUser.username === user.username) {
          newUser.languages.push(user.programming_language);
        }
      })
    }
  });

  return distinctUsers;
}

//The entry point of the application
main();