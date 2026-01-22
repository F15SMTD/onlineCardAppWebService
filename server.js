//include the require packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
    WaitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
};  

//initialize express app
const app = express();
//helps app to read json
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log('Server is running on port', port);
});

//example route: get all cars
app.get('/allcars', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.cars');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error for allcars' });
    }
});

//example route: create a new car
app.post('/addcar', async (req, res) => {
    const { car_name, car_price, car_image } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cars (car_name, car_price, car_image) VALUES (?, ?, ?)',[car_name, car_price, car_image]);
        res.status(201).json({ message: 'Car ' +car_name + ' successfully added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error - could not add car '+ car_name});
    }
}); 

// DELETE a car using route parameter
app.delete('/deletecar/:idcars', async (req, res) => {
    const idcars = req.params.idcars; // get ID from URL

    if(!idcars){
        return res.status(400).json({ message: 'idcars is required' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'DELETE FROM cars WHERE idcars = ?',
            [idcars]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({ message: 'Car with id ' + idcars + ' not found' });
        }

        res.status(200).json({ message: 'Car with id ' + idcars + ' successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error - could not delete car with id ' + idcars });
    } finally {
        if(connection) await connection.end();
    }
});



//example route: modify a car
app.put('/modifycar', async (req, res) => {
    const { idcars, car_name, car_price, car_image } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE cars SET car_name = ?, car_price = ?, car_image = ? WHERE idcars = ?',[car_name, car_price, car_image, idcars]);
        res.status(200).json({ message: 'Car with id ' + idcars + ' successfully modified' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error - could not modify car with id '+ idcars});
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
