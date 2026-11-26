import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import sql from 'mssql';
import { pool } from '../config/database';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response) => {

    try {
        const { pseudo, email, mot_de_passe } = req.body;

        // Validation des informations
        if (
            typeof pseudo !== 'string' ||
            typeof email !== 'string' ||
            typeof mot_de_passe !== 'string'
        ) {
            return res.status(400).json({
                message: 'Tous les champs sont obligatoires.'
            });
        }

        const pseudoNormalise = pseudo.trim();
        const emailNormalise = email.trim().toLowerCase();

        if (
            pseudoNormalise.length < 3 ||
            pseudoNormalise.length > 50
        ) {
            return res.status(400).json({
                message: 'Le pseudo doit contenir entre 3 et 50 caractères.'
            });
        }

        if (
            emailNormalise.length > 180 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalise)
        ) {
            return res.status(400).json({
                message: 'Adresse email invalide.'
            });
        }

        if (
            mot_de_passe.length < 8 ||
            Buffer.byteLength(mot_de_passe, 'utf8') > 72
        ) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins 8 caractères et ne pas dépasser 72 octets.'
            });
        }

        // Vérification des doublons
        const utilisateurExistant = await pool.request()
            .input('email', sql.NVarChar(180), emailNormalise)
            .input('pseudo', sql.NVarChar(50), pseudoNormalise)
            .query(`
                SELECT id_utilisateur
                FROM Utilisateur
                WHERE email = @email OR pseudo = @pseudo
            `);

        if (utilisateurExistant.recordset.length > 0) {
            return res.status(409).json({
                message: 'Cet email ou ce pseudo est déjà utilisé.'
            });
        }

        // Hachage du mot de passe
        const motDePasseHash = await bcrypt.hash(mot_de_passe, 12);

        // Création du compte
        await pool.request()
            .input('pseudo', sql.NVarChar(50), pseudoNormalise)
            .input('email', sql.NVarChar(180), emailNormalise)
            .input('mot_de_passe', sql.NVarChar(255), motDePasseHash)
            .query(`
                INSERT INTO Utilisateur
                    (pseudo, email, mot_de_passe, role)
                VALUES
                    (@pseudo, @email, @mot_de_passe, 'ROLE_USER')
            `);

        return res.status(201).json({
            message: 'Compte créé avec succès.'
        });

    } catch (error: any) {

        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'Cet email ou ce pseudo est déjà utilisé.'
            });
        }

        console.error('Erreur inscription :', error);

        return res.status(500).json({
            message: 'Erreur lors de la création du compte.'
        });
    }
};

export const login = async (req: Request, res: Response) => {

    try {
        const { email, mot_de_passe } = req.body;

        if (
            typeof email !== 'string' ||
            typeof mot_de_passe !== 'string' ||
            !email.trim() ||
            !mot_de_passe ||
            email.trim().length > 180 ||
            Buffer.byteLength(mot_de_passe, 'utf8') > 72
        ) {
            return res.status(400).json({
                message: 'Identifiants invalides.'
            });
        }

        // Recherche de l'utilisateur
        const result = await pool.request()
            .input('email', sql.NVarChar(180), email.trim().toLowerCase())
            .query(`
                SELECT id_utilisateur, pseudo, email, mot_de_passe, role
                FROM Utilisateur
                WHERE email = @email
            `);

        const utilisateur = result.recordset[0];

        if (!utilisateur) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect.'
            });
        }

        // Vérification du mot de passe
        const motDePasseValide = await bcrypt.compare(
            mot_de_passe,
            utilisateur.mot_de_passe
        );

        if (!motDePasseValide) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect.'
            });
        }

        // Vérification de la clé secrète
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET non configuré.');
        }

        // Génération du token
        const token = jwt.sign(
            {
                id_utilisateur: utilisateur.id_utilisateur,
                role: utilisateur.role
            },
            secret,
            {
                algorithm: 'HS256',
                expiresIn: '2h'
            }
        );

        return res.status(200).json({
            message: 'Connexion réussie.',
            token,
            utilisateur: {
                id_utilisateur: utilisateur.id_utilisateur,
                pseudo: utilisateur.pseudo,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });

    } catch (error) {

        console.error('Erreur connexion :', error);

        return res.status(500).json({
            message: 'Erreur lors de la connexion.'
        });
    }
};

export const getProfile = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const result = await pool.request()
            .input(
                'id',
                sql.Int,
                req.utilisateur!.id_utilisateur
            )
            .query(`
                SELECT id_utilisateur, pseudo, email,
                       role, date_inscription
                FROM Utilisateur
                WHERE id_utilisateur = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Utilisateur introuvable.'
            });
        }

        return res.json(result.recordset[0]);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Impossible de récupérer le profil.'
        });
    }
};