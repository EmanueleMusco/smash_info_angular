module.exports={
    eseguiQuery:eseguiQuery
}
async function eseguiQuery(conn, query, params) {
    return new Promise((resolve, reject) => {
      conn.query(query, params, (err, data) => {
        if (err) return reject(err);
  
        return resolve(data);
      })
 })
}