import type { Glob } from "@/types";
import { saveAs } from "file-saver";

export default function (glob: Glob) {
    let receiveIndex = -1;
    let receiveBlob: Blob | null = null;

    function receiveFile(e: MessageEvent<string | ArrayBuffer>) {
        if (typeof e.data === "string") {
            const data = JSON.parse(e.data);
            if (data.type === "start-sending") {
                if (glob.isReceiving.value) {
                    return;
                }
                glob.isReceiving.value = true;
                glob.history.value.push({
                    type: "in",
                    status: "in-progress",
                    filename: data.payload.name,
                    filetype: data.payload.type,
                    filesize: data.payload.size,
                    length: data.payload.length,
                    count: 0,
                    progress: 0,
                });
                receiveIndex = glob.history.value.length - 1;
                receiveBlob = new Blob();
            }

            if (data.type === "paused") {
                const current = glob.history.value[receiveIndex];
                current.status = "paused";
            }

            if (data.type === "canceled") {
                const current = glob.history.value[receiveIndex];
                current.status = "canceled";
            }

            if (data.type === "complete-sending") {
                const current = glob.history.value[receiveIndex];
                current.status = "completed";
                saveAs(receiveBlob!, current.filename);
                glob.isReceiving.value = false;
                receiveIndex = -1;
                receiveBlob = null;
            }
        }

        if (e.data instanceof ArrayBuffer) {
            const current = glob.history.value[receiveIndex];
            current.count++;
            current.progress = current.count / current.length;
            receiveBlob = new Blob([receiveBlob!, e.data], {
                type: current!.type,
            });
        }
    }

    return {
        receiveFile,
    };
}
