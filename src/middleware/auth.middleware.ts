import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
    user?:any;
};

const authMiddleware = (
    req:AuthRequest,
    res:Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(403).json({message:'Authorization token required'});
      
    }
     const token = authHeader.split(' ')[1];
    try {
       const secret = process.env.JWT_SECRET;
       if(!secret) throw new Error("JWT NOT SET")
       // const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const decoded = jwt.verify(token, secret)
       req.user = decoded;
        next();
    } catch {
        res.status(401).json({message:'Invalid token'})
    };
    
};

export default authMiddleware;

