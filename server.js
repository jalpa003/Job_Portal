const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const companyRoutes = require('./routes/companyRoutes');

const corsOptions = {
    origin: "https://job-portal-frontend-6fgu.onrender.com", // frontend URI (ReactJS)
}

// Increase the maximum payload size limit to 10MB
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Atlas Connected`);
})
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });

// Define routes and handle requests
app.get('/', (req, res) => {
    res.send('Welcome to the Job Portal!');
});

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/candidates', candidateRoutes);
app.use('/companies', companyRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
