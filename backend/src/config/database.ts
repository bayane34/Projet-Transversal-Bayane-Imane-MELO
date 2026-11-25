import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
    server: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 1435,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "MELO",

    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

export const pool = new sql.ConnectionPool(config);