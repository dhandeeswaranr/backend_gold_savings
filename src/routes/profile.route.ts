import express, { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';
import { Profile } from '../types/profile';
import authMiddleware from '../middleware/auth.middleware';

export interface AuthRequest extends Request {
    user?: any;
}

const router = Router();

/** INSERT PROFILE */
router.post('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const {user_id, firstName, lastName, address, location, village, city, state, pin, landmark, scheme, isAccept } = req.body;

        if (!user_id || !firstName || !lastName) {
            return res.status(400).json({ error: 'firstName and lastName are required' });
        }

        const result = await pool.query(
            `INSERT INTO profile (user_id, firstName, lastName, address, location, village, city, state, pin, landmark, scheme, isAccept) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
             RETURNING *`,
            [user_id, firstName, lastName, address || null, location || null, village || null, city || null, state || null, pin || null, landmark || null, scheme || null, isAccept || false]
        );

        res.status(201).json({
            message: 'Profile created successfully',
            profile: result.rows[0]
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/** UPDATE PROFILE */
router.put('/profile/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, address, location, village, city, state, pin, landmark, scheme, isAccept } = req.body;

        // Check if profile exists
        const profileExists = await pool.query('SELECT * FROM profile WHERE user_id = $1', [id]);
        if (profileExists.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const result = await pool.query(
            `UPDATE profile 
             SET firstName = COALESCE($1, firstName),
                 lastName = COALESCE($2, lastName),
                 address = COALESCE($3, address),
                 location = COALESCE($4, location),
                 village = COALESCE($5, village),
                 city = COALESCE($6, city),
                 state = COALESCE($7, state),
                 pin = COALESCE($8, pin),
                 landmark = COALESCE($9, landmark),
                 scheme = COALESCE($10, scheme),
                 isAccept = COALESCE($11, isAccept),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $12
             RETURNING *`,
            [firstName, lastName, address, location, village, city, state, pin, landmark, scheme, isAccept, id]
        );

        res.status(200).json({
            message: 'Profile updated successfully',
            profile: result.rows[0]
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/** GET PROFILE BY ID */
router.get('/profile/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query('SELECT * FROM profile WHERE user_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json({
            success: true,
            profile: result.rows[0]
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/** GET ALL PROFILES */
router.get('/profiles', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM profile ORDER BY created_at DESC');

        res.status(200).json({
            success: true,
            profiles: result.rows
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
