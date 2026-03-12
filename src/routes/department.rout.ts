import express, {Router, Application, NextFunction, Request, Response} from 'express';
import authMiddleware from '../middleware/auth.middleware';
import {AuthRequest} from '../types/auth'
import pool from '../db';

const departmentRouter = Router();

departmentRouter.get('/departments', authMiddleware, async (req:AuthRequest, res:Response, next:NextFunction) => {
    console.log("authMiddleware")
    try {
    const result = await pool.query('SELECT dept_id, dept_name FROM departments')
        res.status(200).json({
            success:true,
            res:result.rows
        })
} catch(err) {
    res.status(500).json({success:false, message:'failed to fetch departments'})
    }
})

export default departmentRouter;

