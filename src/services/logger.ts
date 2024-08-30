import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.metadata(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'HH:mm:ss' }),
            format.printf(({ level, message, timestamp, ...meta }) => {
                // Remove o timestamp dos metadados
                const { timestamp: _, ...filteredMeta } = meta.metadata || {};
                const metaString = Object.keys(filteredMeta).length
                ? `{${Object.keys(filteredMeta).map(key => `${key}: ${filteredMeta[key]}`).join(', ')}}`
                : '';
            return `[${level}] ${timestamp}: ${message} ${metaString}`;
        })

        )
    }));
}

export default logger;
