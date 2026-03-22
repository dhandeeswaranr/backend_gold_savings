import express, { Router, Request, Response, Application, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { User } from '../types/user';
import authMiddleware from '../middleware/auth.middleware';
const CryptoJS = require('crypto-js');
export interface AuthRequest extends Request {
    user?: any;
};

const router = Router();
const app: Application = express();


/** REGEISTER USER */
router.post('/register', async (req: Request, res: Response) => {

    try {
        const { name, email, phone, password, roles = 'users' } = req.body;
        console.log("api hit", name, email, password, roles)
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name, email, phone, password, roles) VALUES ($1,$2,$3,$4,$5)',
            [name, email, phone, hashedPassword, roles]
        );
        res.status(201).json({ message: 'Added successfully' });
    } catch (err: any) {
        res.status(400).json({ error: err.message })
    }

});

/**LOGIN */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const secretKey = 'm$r890fz#9';

        const bytes = CryptoJS.AES.decrypt(req.body.data, secretKey);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const { email, password } = decrypted;
        console.log("api hit", email, password)
        //const {email, password} = req.body;
        const result = await pool.query<User>(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid Credential' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password Invalid Credential' });
        }
        console.log("test", user, process.env.JWT_SECRET as string)

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.roles, user_id: user.user_id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );
        //const token = 'erererre'
        console.log("token", token)

        res.json({
            message: "Login Successfully",
            token
        })
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
});

/*router.get('/departments', authMiddleware, (req:AuthRequest, res:Response, next:NextFunction) => {
   console.log("req", req)
    res.json({ message: 'Protected route', user: req.user });
})*/
router.get('/users', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("authMiddleware")
    try {
        const result = await pool.query('SELECT id, name, email, phone, roles FROM users')
        res.status(200).json({
            success: true,
            res: result.rows
        })
    } catch (err) {
        res.status(500).json({ success: false, message: 'failed to fetch departments' })
    }
})

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("authMiddleware")
    try {
        //const result = await pool.query('SELECT id, name, email, phone, roles FROM users')
        res.status(200).json({
            success: true,
            res: "Welcome to the API"
        })
    } catch (err) {
        res.status(500).json({ success: false, message: 'failed' })
    }
})

export default router;