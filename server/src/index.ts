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
    ws.on("message", async (data) => {
        for (const remoteClient of room) {
            if (remoteClient !== ws) {
                remoteClient.send(data);
            }
        }
    });

    ws.on("close", () => {
        room.splice(
            room.findIndex((item) => item === ws),
            1
        );

        if (room.length === 0) {
            rooms.delete(roomId);
        }
    });
});
