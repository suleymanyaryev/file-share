import { createLogger, format, transports } from "winston";
import path from "path";
const { combine, timestamp, printf } = format;

const LEVEL: { [key: string]: string } = {
    error: "ERRO",
    warn: "WARN",
    info: "INFO",
    http: "HTTP",
    verbose: "VERB",
    debug: "DEBG",
    silly: "SILL",
};

const customFormat = printf(({ level, message, timestamp, filename, func }) => {
    let msg = `[${timestamp}] ${LEVEL[level]} msg: \`${message}\`;`;
    if (func) {
        msg = `${msg} func: \`${func}\`;`;
    }
    if (filename) {
        const p = path.relative(process.cwd(), filename);
        msg = `${msg} path: \`${p}\`;`;
    }
    return msg;
});

const logger = createLogger({
    level: "debug",
    format: combine(timestamp(), customFormat),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: "./logs/error.log",
            level: "error",
        }),
        new transports.File({ filename: "./logs/combined.log" }),
    ],
});

export { logger };
