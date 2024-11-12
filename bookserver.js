require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Load environment variables
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

// CRUD routes

// Create a book
app.post('/books', async (req, res) => {
    try {
        const { title } = req.body;
        const book = new Book({ title });
        await book.save();
        console.log('Book saved:', title);
        res.status(201).send(book);
    } catch (error) {
        console.error('Error saving book:', error);
        res.status(500).send({ error: 'Failed to save book' });
    }
});

// Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.send(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});

// Get a single book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send({ error: 'Book not found' });
        res.send(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).send({ error: 'Failed to fetch book' });
    }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const result = await Book.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).send({ error: 'Book not found' });
        res.send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send({ error: 'Failed to delete book' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
