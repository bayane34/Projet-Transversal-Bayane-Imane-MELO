import { Request, Response } from "express";
import { pool } from "../config/database";

export const getMorceaux = async (req: Request, res: Response) => {
    try {
        const result = await pool.request().query(`
            SELECT Morceau.*, Album.titre_album, Artiste.nom_artiste
            FROM Morceau
            INNER JOIN Album
                ON Morceau.id_album = Album.id_album
            INNER JOIN Artiste
                ON Album.id_artiste = Artiste.id_artiste
            ORDER BY Morceau.titre_morceau
        `);

        res.json(result.recordset);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la récupération des morceaux"
        });
    }
};