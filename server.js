const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Load songs from JSON file
let songs = [];
const loadSongs = async () => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'songs.json'), 'utf8');
        songs = JSON.parse(data);
        console.log('Songs loaded successfully');
    } catch (error) {
        console.error('Error loading songs:', error);
    }
};

// API Routes
// Get all songs
app.get('/api/songs', (req, res) => {
    res.json(songs);
});

// Get song by ID
app.get('/api/songs/:id', (req, res) => {
    const song = songs.find(s => s.id === parseInt(req.params.id));
    if (!song) {
        return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
});

// Get songs by artist
app.get('/api/songs/artist/:artist', (req, res) => {
    const artistSongs = songs.filter(s => 
        s.artist.toLowerCase().includes(req.params.artist.toLowerCase())
    );
    if (artistSongs.length === 0) {
        return res.status(404).json({ error: 'No songs found for this artist' });
    }
    res.json(artistSongs);
});

// Start server
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    await loadSongs();
});
