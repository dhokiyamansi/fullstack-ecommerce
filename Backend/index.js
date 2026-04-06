const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

//nosql database
const UsersRoute = require('./routes/auth');
const productRoutes = require('./routes/productlist')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
//sql database
const orderRoute = require('./routes/order')   

// Routes
app.use('/auth/', UsersRoute);
app.use('/productlist/',productRoutes);
app.use('/product/', productRoute);
app.use('/cart/',cartRoute);
app.use('/order/',orderRoute);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






