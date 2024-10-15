import express from "express";
import { connectionDB } from "./DB/connection.js";
import {config} from "dotenv";
import path from "path";

import * as allRouter from './src/modules/index.routes.js';

config({ path: path.resolve('./config/config.env') });

const app = express();
const PORT = +process.env.PORT;

app.use(express.json());
connectionDB();

app.use('/user' , allRouter.userRouter);
app.use('/admin' , allRouter.adminRouter);
app.use('/product' , allRouter.productRouter);
app.use('/category' , allRouter.categoryRouter);
app.use('/table' , allRouter.tableRouter);
app.use('/order' , allRouter.orderRouter);
app.use('/reservation' , allRouter.reservationRouter)
app.use('/supplier' , allRouter.supplierRouter);
app.use('/inventory' , allRouter.inventoryRouter);
app.use('/report' , allRouter.reportRouter);

app.all('*' , (req , res) => {
    res.status(404).json({
        message : "URL Not Found"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});