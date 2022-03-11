import { config } from "@/config";
import WebSocket, { WebSocketServer } from "ws";

const rooms = new Map<string, WebSocket[]>();

const wss = new WebSocketServer({
    host: config.HOST,
    port: config.PORT,
});

wss.on("connection", (ws, req) => {
    const url = req.url;
    if (!url) {
        ws.close();
        return;
    }

    const roomId = url.slice(1).split("/")[0];
    if (!roomId) {
        ws.close();
        return;
    }

    if (!rooms.has(roomId)) {
        rooms.set(roomId, []);
    } else if (rooms.get(roomId)!.length >= 2) {
        ws.close();
        return;
    }

    const room = rooms.get(roomId)!;

    ws.on("message", async (rawData) => {
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
            room.push(ws);
        }

        if (data.type === "client-offer") {
            for (const remoteClient of room) {
                if (remoteClient !== ws) {
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
                if (remoteClient !== ws) {
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
                if (remoteClient !== ws) {
                    remoteClient.send(
                        JSON.stringify({
                            type: "client-ice-candidate",
                            payload: {
                                iceCandidate: data.payload.iceCandidate,
                            },
                        })
                    );
                }
            }
        }
    });

    ws.on("close", () => {
        console.log("client disconnected");

        room.splice(
            room.findIndex((item) => item === ws),
            1
        );

        if (room.length === 0) {
            rooms.delete(roomId);
        }

        for (const remoteClient of room) {
            remoteClient.send(
                JSON.stringify({
                    type: "client-disconnected",
                })
            );
        }
    });
});
