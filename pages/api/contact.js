import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, message } = req.body;

    if (
      !email ||
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !message ||
      message.trim() === ''
    ) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }

    // Store it in a database
    const newMessage = {
      email,
      name,
      message,
    };

    let client;

    const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.ehe1nta.mongodb.net/?retryWrites=true&w=majority`;

    try {
      client = new MongoClient(connectionString);
      await client.connect();
      console.log('Connected succesfully to server');
    } catch (error) {
      res.status(500).json({ message: 'Could not connetct to database' });
      return;
    }

    const db = client.db(process.env.mongodb_database);

    try {
      const result = await db.collection('messages').insertOne(newMessage);
      // console.log('Inderted document =>', result);
      newMessage.id = result.insertedId;
    } catch (error) {
      client.close();
      res.status(500).json({ message: 'Storing message failed!' });
    }

    client.close();

    res
      .status(201)
      .json({ message: 'Successfully stored message!', newMessage });
  }
}

export default handler;
