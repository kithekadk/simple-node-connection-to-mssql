import express, { json, NextFunction, Request, Response} from 'express';
import router from './routers/router';
const app = express();

app.use(json());

app.use(('/users'), router)//problem with this line!!!!!!!!!!!!!!!!===============

app.use((err: Error, req:Request, res:Response, next:NextFunction)=>{
    res.json({message:err.message})
})

app.listen(3500,()=>{
console.log('app running...');

})
