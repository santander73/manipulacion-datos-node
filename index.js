import express, { json } from 'express';
import { insertActor, updateActorBirthdate, deleteActor } from './db.js';

const app = express();
const PORT = 3000;

// Middleware vital para que Express entienda el request.body en formato JSON
app.use(json());

// --- ENDPOINTS ---

// 1. Endpoint para Insertar Registro (POST)
app.post('/actors', async (req, res) => {
    const { name, birthdate, nationality } = req.body;

    // Validación básica
    if (!name || !birthdate || !nationality) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (name, birthdate, nationality)' });
    }

    try {
        const newActor = await insertActor(name, birthdate, nationality);
        res.status(201).json({ message: 'Actor creado con éxito', data: newActor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al insertar el actor' });
    }
});

// 2. Endpoint para Actualizar birthdate (PUT o PATCH)
app.put('/actors/:id', async (req, res) => {
    const { id } = req.params;
    const { birthdate } = req.body;

    if (!birthdate) {
        return res.status(400).json({ error: 'El campo birthdate es obligatorio para actualizar' });
    }

    try {
        const updatedActor = await updateActorBirthdate(id, birthdate);
        if (!updatedActor) {
            return res.status(404).json({ error: `No se encontró ningún actor con el ID ${id}` });
        }
        res.status(200).json({ message: 'Actor actualizado con éxito', data: updatedActor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el actor' });
    }
});

// 3. Endpoint para Eliminar Registro (DELETE)
app.delete('/actors/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const rowCount = await deleteActor(id);
        if (rowCount === 0) {
            return res.status(404).json({ error: `No se encontró ningún actor con el ID ${id}` });
        }
        res.status(200).json({ message: `Actor con ID ${id} eliminado con éxito` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el actor' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor API escuchando en http://localhost:${PORT}`);
});