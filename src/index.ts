import express from 'express';
import swaggerUi from 'swagger-ui-express'
import logger from './services/logger';
import uploadRoute from './routes/uploadRoute';
import confirmRoute from './routes/confirmRoute';
import imageRoute from './routes/imageRoute';
import listRoute from './routes/listRoute';
import { connectToDatabase } from './db';
import swaggerDocs from "./swagger.json";

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
connectToDatabase(mongoUri).then(() => {

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
    app.use(uploadRoute);
    app.use(confirmRoute);
    app.use(listRoute);
    app.use(imageRoute);


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.info(`Servidor iniciado na porta ${PORT}`);
    });
}).catch((error) => {
    logger.error('Erro ao conectar ao MongoDB:', error);
});
