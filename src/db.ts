import { MongoClient, Db } from 'mongodb';

let db: Db;

export async function connectToDatabase(uri: string) {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('measures_readings');
    console.log('Conectado ao MongoDB');
}

export function getDb(): Db {
    return db;
}
