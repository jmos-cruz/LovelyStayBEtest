const daoQueries = {
  insert: 'INSERT INTO $1:name VALUES ',
  selectLeftJoin: 'SELECT $1:name FROM users AS u LEFT JOIN user_languages AS ul ',
  selectDistinct: 'SELECT DISTINCT $1:name FROM $2:name'
}

daoQueries.selectLeftJoin += 'ON u.id = ul.user_id';

Object.freeze(daoQueries);

export default daoQueries;