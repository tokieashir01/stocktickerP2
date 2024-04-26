const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://teashir:stocktickerdatabasepassword@cluster0.nmplax3.mongodb.net/";
const fs = require('fs');
const express = require('express'); 
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'stockticker.html'));
});

app.get('/process', async (req, res) => {
    const query = req.query.query.toLowerCase();
    const searchType = req.query.searchType;

    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db("Stock");
        const collection = db.collection("PublicCompanies");

        let results = [];

        if (searchType === 'ticker') {
            results = await collection.find({ ticker: query.toUpperCase() }).toArray();
        } else {
            results = await collection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        }

        console.log('Search Results:', results);
        res.json(results);
        
        client.close();
    } 
    catch (err) {console.log("Database error: " + err);}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});