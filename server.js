const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:3001', // Yahan aap apne frontend ka URL daal sakte hain
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type'] // Allowed headers
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URL
const url = 'mongodb://localhost:27017/beauty_parlour'; // Your database name

// Connect to MongoDB using Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// Define your Mongoose schemas and models here
const appointmentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    service: String,
    date: Date,
    time: String
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Beauty Parlour API!'); // Simple response for root URL
});

// Endpoint to handle appointment submission
app.post('/api/appointments', (req, res) => {
    const appointmentData = req.body; // Get the appointment data from the form
    console.log('Appointment Data:', appointmentData); // Log it to the console
    const newAppointment = new Appointment(appointmentData);

    newAppointment.save()
        .then(() => {
            res.json({ message: 'Appointment booked successfully!', data: appointmentData });
        })
        .catch(err => {
            console.error('Error saving appointment:', err);
            res.status(500).json({ message: 'Error booking appointment.' });
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
