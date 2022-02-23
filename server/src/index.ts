import express from "express";
import type { Request, Response, NextFunction, Router } from "express";
import { logger } from "@/logger";
import { config } from "@/config";
import { HttpError } from "@/error";
import WebSocket from "ws";

const app = express();

const ws = new WebSocket.Server({ noServer: true });
const rooms = new Map<string, any[]>();

app.get(
    "/api/v1/room/:roomId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roomId = req.params.roomId;

            if (!rooms.has(roomId)) {
                rooms.set(roomId, []);
            } else if (rooms.get(roomId)!.length >= 2) {
                res.status(403);
                res.json({
                    success: false,
                });
                return;
            }

            const room = rooms.get(roomId)!;

            ws.handleUpgrade(req, req.socket, Buffer.alloc(0), (client) => {
                client.on("message", async (rawData) => {
                    const data = JSON.parse(rawData.toString());

                    if (data.type === "client-connected") {
                        console.log("new client connected");
                        for (const remoteClient of room) {
                            remoteClient.send(
                                JSON.stringify({
                                    type: "client-connected",
                                })
                            );
                        }
                        room.push(client);
                    }

                    if (data.type === "client-offer") {
                        for (const remoteClient of room) {
                            if (remoteClient !== client) {
                                remoteClient.send(
                                    JSON.stringify({
                                        type: "client-offer",
                                        payload: {
                                            offer: data.payload.offer,
                                        },
                                    })
                                );
                            }
                        }
                    }

                    if (data.type === "client-answer") {
                        for (const remoteClient of room) {
                            if (remoteClient !== client) {
                                remoteClient.send(
                                    JSON.stringify({
                                        type: "client-answer",
                                        payload: {
                                            answer: data.payload.answer,
                                        },
                                    })
                                );
                            }
                        }
                    }

                    if (data.type === "client-ice-candidate") {
                        for (const remoteClient of room) {
                            if (remoteClient !== client) {
                                remoteClient.send(
                                    JSON.stringify({
                                        type: "client-ice-candidate",
                                        payload: {
                                            iceCandidate:
                                                data.payload.iceCandidate,
                                        },
                                    })
                                );
                            }
                        }
                    }
                });

                client.on("close", () => {
                    console.log("client disconnected");

                    room.splice(
                        room.findIndex((item) => item === client),
                        1
                    );
                    for (const remoteClient of room) {
                        remoteClient.send(
                            JSON.stringify({
                                type: "client-disconnected",
                            })
                        );
                    }
                });
            });
        } catch (err) {
            logger.error("Caught error on Controller.User.Login", {
                filename: __filename,
            });
            next(err);
        }
    }
);

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
