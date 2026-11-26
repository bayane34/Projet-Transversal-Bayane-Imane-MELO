import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    utilisateur?: {
        id_utilisateur: number;
        role: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authentification requise.'
        });
    }

    const token = authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return res.status(500).json({
            message: 'Erreur de configuration du serveur.'
        });
    }

    try {
        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256']
        });

        if (
            typeof decoded === 'string' ||
            !Number.isInteger(decoded.id_utilisateur) ||
            !['ROLE_USER', 'ROLE_ADMIN'].includes(decoded.role)
        ) {
            return res.status(401).json({
                message: 'Token invalide.'
            });
        }

        req.utilisateur = {
            id_utilisateur: decoded.id_utilisateur,
            role: decoded.role
        };

        next();

    } catch {
        return res.status(401).json({
            message: 'Token invalide ou expiré.'
        });
    }
};

export const authorizeAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    if (!req.utilisateur) {
        return res.status(401).json({
            message: 'Authentification requise.'
        });
    }

    if (req.utilisateur.role !== 'ROLE_ADMIN') {
        return res.status(403).json({
            message: 'Accès réservé aux administrateurs.'
        });
    }

    next();
};