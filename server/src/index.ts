import express from "express";
import { logger } from "@/logger";
import { config } from "@/config";
import { HttpError } from "@/error";

const app = express();

app.use(
    (
        err: Error,
        _: express.Request,
        res: express.Response,
        __: express.NextFunction
    ) => {
        logger.error(err.message, { filename: __filename });
        if (err instanceof HttpError) {
            const { statusCode, message, text } = err as HttpError;
            logger.error(`Error: ${statusCode} '${text}'`);
            res.status(statusCode);
            res.json({
                success: false,
                err_msg: message,
            });
            return;
        }
        logger.error(`Error: ${500} 'Internal Server Error'`, {
            filename: __filename,
        });
        res.status(500);
        res.json({
            success: false,
            err_msg: "Internal server error",
        });
    }
);

async function startServer() {
    try {
        await app.listen(config.PORT, config.HOST);
        logger.info(`Listen on port ${config.PORT}`, { filename: __filename });
    } catch (err: any) {
        logger.error(err.message, { filename: __filename });
    }
}

startServer();
