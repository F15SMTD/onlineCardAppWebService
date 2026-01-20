const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = 3000;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});


// GET all cars (mobile list page)
app.get('/cars', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM cars');
    await conn.end();
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});


// ADD car (mobile admin / form)
app.post('/cars', async (req, res) => {
  const { car_name, car_price, car_image } = req.body;

  if (!car_name || !car_price || !car_image) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      'INSERT INTO cars (car_name, car_price, car_image) VALUES (?, ?, ?)',
      [car_name, car_price, car_image]
    );
    await conn.end();
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to add car' });
  }
});


// UPDATE car
app.put('/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { car_name, car_price, car_image } = req.body;

  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      'UPDATE cars SET car_name=?, car_price=?, car_image=? WHERE car_id=?',
      [car_name, car_price, car_image, id]
    );
    await conn.end();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update car' });
  }
});


// DELETE car
app.delete('/cars/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('DELETE FROM cars WHERE car_id=?', [id]);
    await conn.end();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});


//example route: get all cards
//app.get('/allcards', async (req, res) => {
//    try {
//        let connection = await mysql.createConnection(dbConfig);
//        const [rows] = await connection.execute('SELECT * FROM defaultdb.cards');
//        res.json(rows);
//    } catch (error) {
//        console.error(err);
//        res.status(500).json({ message: 'Server error for allcards' });
//    }
//});

//example route: create a new card
//app.post('/addcard', async (req, res) => {
//   const { card_name, card_pic } = req.body;
//    try{
//        let connection = await mysql.createConnection(dbConfig);
//        await connection.execute('INSERT INTO cards (card_name, card_pic) VALUES (?, ?)',[card_name, card_pic]);
//        res.status(201).json({ message: 'Card' +card_name + 'successfully added' });
//    } catch (err) {
//        console.error(err);
//        res.status(500).json({ message: 'Server error - could not add card '+ card_name});
//    }}); 
