const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose.connect('mongodb+srv://user0:user0@cluster0.4muvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Song Schema
const songSchema = new mongoose.Schema({
    id: Number,
    title: String,
    artist: String,
    genre: String,
    year: Number
});

const Song = mongoose.model('Song', songSchema);

// API Routes
// Get all songs
app.get('/api/songs', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching songs' });
    }
});

// Get song by ID
app.get('/api/songs/:id', async (req, res) => {
    try {
        const song = await Song.findOne({ id: req.params.id });
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching song' });
    }
});

// Get songs by artist
app.get('/api/songs/artist/:artist', async (req, res) => {
    try {
        const songs = await Song.find({ artist: new RegExp(req.params.artist, 'i') });
        if (songs.length === 0) {
            return res.status(404).json({ error: 'No songs found for this artist' });
        }
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching songs' });
    }
});

// Initialize database with songs from songs.json
const initializeDatabase = async () => {
    try {
        const songs = require('./songs.json');
        await Song.deleteMany({}); // Clear existing data
        await Song.insertMany(songs);
        console.log('Database initialized with songs');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    initializeDatabase();
});
