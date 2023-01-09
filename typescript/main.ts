//Utilitary file containing only messages
//for the command-line
import *  as messages from './messages'; 

//Data access object file with database access functions
import * as dao from './dataaccess';

//Interface file with user prompts
import * as userGui from './interface';

/*
The main function of the application
Functions as both the command-line interface and 
the app controller
*/
let main = async (): Promise<void> => {

  let option: number = await userGui.getUserNumber(messages.MENU);

  switch(option) {
    //Prompts the user for a GitHub username
    //and stores it in the database, if found
    case 1:
      let username: string = await userGui.getUserText(messages.USERNAMEQUERY);
      let user: dao.User = await fetchUser(username);

      if(user.id === -1) {
        console.log(messages.USERNOTFOUND);
        break;
      }
      //Have to return a value here to check if an error occurred
      await dao.insertUser(user);
      break;

    //Returns all stored users
    case 2:
      console.log(await dao.getAllUsers());
      break;

    //Returns a list of users by location or programming language
    case 3:
      let locations: Array<string> = await dao.getAllLocations();

      let locationOptions: Array<string> = locations.filter((item, pos) => {
        return locations.indexOf(item) == pos;
      });

      locationOptions = locationOptions.map(
        string => string == null ? 'null' : string
      );

      let queryOption: number = await userGui.getUserNumber(locationOptions);
      let locationSelected: string = locationOptions[queryOption-1];

      if(locationSelected) {
        console.log(await dao.getUsersByLocation(locationSelected));
      } else {
        console.log(messages.OPTIONERROR);
      }

      break;

    //Quits the application
    case 4:
      console.log(messages.GOODBYE);
      userGui.r1.close();
      dao.pgp.end();
      return;

    //In case option typed is either NaN or non-existing
    default:
      console.log(messages.OPTIONERROR);
      break;
    }

  //Recursive call to main function
  main();

}

//Fetches a GitHub user from the GitHub API
let fetchUser = async (username: string): Promise<dao.User> => {
  const response = await fetch(messages.GITHUBAPI + username);
  const fetchedUser = await response.json();

  //Fetching a non-existing user returns an object with
  //a message property, which is not present
  //in an existing user object
  if(fetchedUser.message) {
    return {
      id: -1,
      login: '',
      name: null,
      location: null
    };
  }
  return {
    id: fetchedUser.id,
    login: fetchedUser.login,
    name: fetchedUser.name,
    location: fetchedUser.location
  };
}

//The entry point of the application
main();