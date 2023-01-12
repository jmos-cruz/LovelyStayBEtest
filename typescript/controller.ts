//Utilitary file containing only messages
//for the command-line
import *  as messages from './messages'; 

//Data access object file with database access functions
import * as dao from './dataaccess';

import User from './userTypes';
import { DaoUser, emptyUser, emptyDaoUser } from './userTypes';

//Interface file with user prompts
import { r1 } from './userInterface';

//Validate if user exists in the database
let checkIfUserInDb = async (username: string): Promise<boolean> => {
  return await dao.getUserByUsername(username) ? true : false;
}

//Prompts user to select a location that exists
//in the database and fetch all users that share 
//the selected location
let queryUsersByLctn = async (location: string): Promise<Array<DaoUser>> => {

  //Returns all users that share the same location
  location = location === 'null' ? 'IS NULL' : location;
  return await dao.getUsersByLctn(location);

}

//Returns ': Promise<Array<Array<DaoUser>>>'
//Adding this exceeds the 80 characters limit
let queryUsersByLang = async (language: string) => {
  return await dao.getUsersByLanguage(language);
}

let insertUserInDb = async (user: User): Promise<void> => {
  await dao.insertUser(user);
}

let getAllUsersFromDb = async (): Promise<Array<DaoUser>> => {
  return await dao.getAllUsers();
}

//Obtains all locations stored in the database
//to use for user prompt
let getAllLocationsFromDb = async(): Promise<Array<string>> => {
  let locationObjs: Array<any> = await dao.getAllLocations();

  let locations: Array<string>;
  locations = locationObjs.map(obj => obj = obj.location);

  return locations.map(
    string => string == null ? 'null' : string
  );
}

let getAllLanguagesFromDb = async (): Promise<Array<string>> => {
  let languageObjs: Array<any> = await dao.getAllLanguages();

  let languages: Array<string>;
  languages = languageObjs.map(obj => obj = obj.programming_language);

  return languages.map(
    string => string == null ? 'null' : string
  );
}

//Fetches a GitHub user from the GitHub API
let fetchUserFromApi = async (username: string): Promise<User> => {
  let fetchedUser;
  fetchedUser = await fetchFromApi(messages.GITHUBAPI + username);
  
  //Fetching a non-existing user returns an object with
  //a message property, which is not present
  //in an existing user object
  if(fetchedUser.message) {
    return emptyUser;
  }

  let user = {
    id: fetchedUser.id,
    username: fetchedUser.login,
    fullname: fetchedUser.name,
    location: fetchedUser.location,
    languages: new Array<string>
  };

  let reposLinks: Array<string> = await fetchUserRepos(user);

  await Promise.all(reposLinks.map(async url => {
    let repoLanguages: Array<string>;
    repoLanguages = Object.keys(await fetchFromApi(url));

    repoLanguages.forEach(language => {
      if(!user.languages.includes(language)){
        user.languages.push(language);
      }
    });

  }));

  return user;
}

let fetchUserRepos = async (user: User): Promise<Array<string>> => {
  let userReposApi: string;
  userReposApi = messages.GITHUBAPI + user.username + "/repos";

  const userRepos: Array<any>  = await fetchFromApi(userReposApi);

  return userRepos.map(repos => {return repos.languages_url});
}

let fetchFromApi = async (link: string) => {
  const response = await fetch(link); 
  return await response.json();
}

let close = (): void => {
  r1.close();
  dao.pgp.end();
}

export {
  checkIfUserInDb,
  insertUserInDb,
  getAllUsersFromDb,
  getAllLocationsFromDb,
  getAllLanguagesFromDb,
  queryUsersByLctn,
  queryUsersByLang,
  fetchUserFromApi,
  close
}