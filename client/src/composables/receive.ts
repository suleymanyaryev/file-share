import type { Glob, HistoryItem } from "@/types";
import { saveAs } from "file-saver";

export default function (glob: Glob) {
    let current: HistoryItem | null = null;

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
                    file: null,
                    blob: new Blob(),
                    filename: data.payload.name,
                    filetype: data.payload.type,
                    filesize: data.payload.size,
                    length: data.payload.length,
                    count: 0,
                    progress: 0,
                });
                current = glob.history.value[glob.history.value.length - 1];
            }

            if (data.type === "paused") {
                current!.status = "paused";
            }

            if (data.type === "resumed") {
                current!.status = "in-progress";
            }

            if (data.type === "canceled") {
                current!.status = "canceled";
                glob.isReceiving.value = false;
                current!.blob = null;
            }

            if (data.type === "complete-sending") {
                current!.status = "completed";
                saveAs(current!.blob!, current!.filename);
                glob.isReceiving.value = false;
                current!.blob = null;
            }
        }

        if (e.data instanceof ArrayBuffer) {
            current!.count++;
            current!.progress = current!.count / current!.length;
            current!.blob = new Blob([current!.blob!, e.data], {
                type: current!.type,
            });
        }
    }

    return {
        receiveFile,
    };
}
