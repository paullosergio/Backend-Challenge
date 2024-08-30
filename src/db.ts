import logger from './services/logger';
import { MongoClient, Db } from 'mongodb';

let db: Db | undefined;
let connectPromise: Promise<void> | undefined;

export async function connectToDatabase(uri: string) {
    if (!connectPromise) {
        connectPromise = (async () => {
            const client = new MongoClient(uri);
            await client.connect();
            db = client.db('measures_readings');
            logger.info('Conectando ao MongoDB');
        })();
    }
    await connectPromise;
}

export async function getDb(): Promise<Db> {
    await connectToDatabase(process.env.MONGO_URI || 'mongodb://localhost:27017');
    return db!;
}