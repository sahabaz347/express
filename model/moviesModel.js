const connection = require('./../connection');
exports.getMovieList = async (id = 0) => {
    let query = "SELECT * FROM movie_list";
    if (id != 0) {
        query = `SELECT * FROM movie_list WHERE ID=?`;
    }
    const values = [id];
    return await executeQuery(query, values);
}
exports.postMovieList = async (data) => {
    const updateColumn = Object.keys(data).map(key => `${key}=?`).join(',');
    const query = `INSERT INTO movie_list SET ${updateColumn}`;
    const values = [...Object.values(data)]
    return await executeQuery(query, values);
}
exports.updateMovieByPut = async (type, id, data) => {
    if (type == 'PUT') {
        const updateColumn = Object.keys(data).map(key => `${key}=?`).join(',');
        const query = `UPDATE movie_list SET ${updateColumn} WHERE id=?`;
        const values = [...Object.values(data), id]
        return await executeQuery(query, values);
    } else if (type == 'PATCH') {
        const updateColumn = Object.keys(data).map(key => `${key}=?`).join(',');
        let query = `UPDATE movie_list SET ${updateColumn} WHERE id=?`;
        values = [...Object.values(data), id];
        return await executeQuery(query, values);

    }
}
exports.deleteMovieFromList = async (id) => {
    query = `DELETE FROM movie_list WHERE ID=?`;
    const values = [id];
    return await executeQuery(query, values);
}
const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, results, fields) => {
            if (err) {
                console.error('Error executing the query:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

