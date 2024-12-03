const express = require('express');
const mongoose = require('mongoose');
const bookingrRoutes = require('./routes/bookingsRoutes');
const movieRoutes = require('./routes/moviesRoutes');
const allRoutes = require('./routes/index');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://jhangs:Heidy0605@cluster0.hlxpa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/assignment10', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use('/', allRoutes);

// console.log("APP STACK" ,app._router.stack);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
