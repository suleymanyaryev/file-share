import dotenv from "dotenv";
dotenv.config();

declare global {
    interface Config {
        HOST: string;
        PORT: number;
    }
}

console.log(Number(process.env.PORT));

const config: Config = {
    HOST: process.env.HOST || "127.0.0.1",
    PORT: Number(process.env.PORT) || 5000,
};

export { config };
