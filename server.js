const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection")
const cors = require("cors");
connectDb();
const app=express();
app.use(cors("*"));
const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/api/users", require("./Routes/UserRoutes"))
app.listen(port,()=>{
    console.log(`Server running at ${port}`);
})