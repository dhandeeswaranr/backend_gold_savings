import express, { Application } from 'express';
import initDB from './db_initialization/db.init';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.route';
import { User } from './types/user';
import departmentRouter from './routes/department.rout';
import profileRouter from './routes/profile.route';
import cors from 'cors';


initDB();
dotenv.config();

const app: Application = express();
app.use(cors({
    origin: ['http://localhost:8100',
        'http://192.168.68.107:8100'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
const app_url = '/v1/api/';

app.use('/api/auth', authRoutes);
app.use(app_url, departmentRouter);
app.use(app_url, profileRouter);

app.listen(3000, '0.0.0.0', () => {
    console.log("SERVER LISTENING 3000");
});