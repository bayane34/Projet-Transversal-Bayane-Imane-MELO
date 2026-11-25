import { Request, Response } from "express";
import { pool } from "../config/database";

export const getArtistes = async (req: Request, res: Response) => {
    try {
        const result = await pool.request().query(`
            SELECT *
            FROM Artiste
            ORDER BY nom_artiste
        `);

        res.json(result.recordset);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la récupération des artistes"
        });
    }
};