const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { resolve } = require('path');
const User = require('./schema');const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MG_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

app.use(express.static('static'));

app.post('/menu', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        if (!name || !description || !price)
            return res.status(400).json({ message: 'Fill all the fields' });

        const newUser = new User({ name, description, price });
        await newUser.save();
        return res.status(201).json({ message: 'Menu item added', data: newUser });
    } catch (e) {
        console.error(' Error in POST /menu:', e.message);
        res.status(500).json({ error: e.message });
    }
});


app.get('/menu', async (req, res) => {
    try {
        const menuItems = await User.find(); 
        res.json(menuItems);
    } catch (error) {
        console.error(' Error in GET /menu:', error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
});


app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
