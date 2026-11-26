import { Request, Response } from "express";
import { pool } from "../config/database";

export const getAlbums = async (req: Request, res: Response) => {
    try {
        const result = await pool.request().query(`
            SELECT Album.*, Artiste.nom_artiste, Genre.nom_genre
            FROM Album
            INNER JOIN Artiste
                ON Album.id_artiste = Artiste.id_artiste
            INNER JOIN Genre
                ON Album.id_genre = Genre.id_genre
            ORDER BY Album.titre_album
        `);

        res.json(result.recordset);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la récupération des albums"
        });
    }
};