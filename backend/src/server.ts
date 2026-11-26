import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/database";
import artisteRoutes from "./routes/artiste.routes";
import albumRoutes from "./routes/album.routes";
import morceauRoutes from "./routes/morceau.routes";
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
    origin: "http://localhost:4200"
}));

app.use(express.json());
app.use("/api/artistes", artisteRoutes);

app.use("/api/albums", albumRoutes);

app.use("/api/morceaux", morceauRoutes);

app.use('/api/auth', authRoutes);

app.get("/api/health", async (req, res) => {
    try {
        await pool.request().query("SELECT 1");

        res.json({
            message: "MELO API opérationnelle",
            database: "Connectée"
        });
    } catch {
        res.status(503).json({
            database: "Déconnectée"
        });
    }
});

pool.connect()
    .then(() => {
        console.log("Connexion SQL Server réussie");

        app.listen(PORT, () => {
            console.log(`Serveur MELO : http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Erreur SQL Server :", error);
    });