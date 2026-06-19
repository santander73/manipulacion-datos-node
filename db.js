import { Pool, types } from 'pg';

types.setTypeParser(1082, function (v) { return v; });
// Configura aquí las credenciales de tu base de datos local
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'actores_',
    password: 'Postgres123',
    port: 5432,
});

// 1. Función para insertar un actor nuevo
const insertActor = async (name, birthdate, nationality) => {
    const query = 'INSERT INTO actors (name, birthdate, nationality) VALUES ($1, $2, $3) RETURNING *;';
    const values = [name, birthdate, nationality];
    const result = await pool.query(query, values);
    return result.rows[0]; // Retorna el registro insertado
};

// 2. Función para actualizar la fecha de nacimiento (birthdate) por ID
const updateActorBirthdate = async (id, birthdate) => {
    const query = 'UPDATE actors SET birthdate = $2 WHERE id = $1 RETURNING *;';
    const values = [id, birthdate];
    const result = await pool.query(query, values);
    return result.rows[0]; // Retorna el registro modificado
};

// 3. Función para eliminar un actor por ID
const deleteActor = async (id) => {
    const query = 'DELETE FROM actors WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rowCount; // Retorna la cantidad de filas eliminadas (0 o 1)
};

export {
    insertActor,
    updateActorBirthdate,
    deleteActor
};