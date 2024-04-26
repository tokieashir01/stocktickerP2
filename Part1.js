const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://teashir:stocktickerdatabasepassword@cluster0.nmplax3.mongodb.net/";
const fs = require('fs');

async function main() {
  MongoClient.connect(url, async function(err, db) {
    if(err) { return console.log(err);}
  
    var dbo = db.db("Stock");
	  var collection = dbo.collection('PublicCompanies');

    const filePath = 'companies-1.csv';

    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    let insertedCount = 0;

    for (let i = 1; i < lines.length - 1; i++) {
      const line = lines[i];
      const [name, ticker, price] = line.split(/,(?=(?:[^"]|"[^"]*")*$)/);

      // Insert data in collection
      await collection.insertOne({ name, ticker, price: parseFloat(price) });
      console.log(`Inserted: ${name}, ${ticker}, ${price}`);
      insertedCount++;
    }

    console.log(`Total Inserted: ${insertedCount}`);
    await db.close(); 
	
  });
}

main().catch(console.error);
 