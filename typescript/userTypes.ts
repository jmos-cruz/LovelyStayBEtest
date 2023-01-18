type User = {
  id: number,
  username: string,
  fullname: string | null,
  location: string | null,
  languages: Array<string>
}

type DaoUser = {
  id: number,
  username: string,
  fullname: string | null,
  location: string | null,
  programming_language: string
}

const emptyUser = {
  id: -1,
  username: '',
  fullname: null,
  location: null,
  languages: []
}

const emptyDaoUser = {
  id: -1,
  username: '',
  fullname: null,
  location: null,
  programming_language: ''
}

export default User;
export { DaoUser, emptyUser, emptyDaoUser };