import type { Glob } from "@/types";

export default function (glob: Glob) {
    function nextFile() {
        if (glob.queue.value.length > 0) {
            const file = glob.queue.value[0];
            glob.queue.value = glob.queue.value.slice(1);
            sendFile(file);
        }
    }

    function sendFile(file: File) {
        if (!glob.dc) {
            return;
        }

        if (!glob.isConnected.value) {
            return;
        }

        if (glob.isSending.value) {
            glob.queue.value.push(file);
            return;
        }

        glob.isSending.value = true;

        const name = file.name;
        const type = file.type;
        const size = file.size;

        const maxMessageSize = 64 * 1024;
        const length =
            Math.trunc(size / maxMessageSize) +
            (size % maxMessageSize !== 0 ? 1 : 0);

        const maxBufferedAmount = 12 * 1024 * 1024;

        glob.history.value.push({
            type: "out",
            status: "in-progress",
            filename: name,
            filetype: type,
            filesize: size,
            length: length,
            count: 0,
            progress: 0,
        });

        const current = glob.history.value[glob.history.value.length - 1];

        glob.dc.bufferedAmountLowThreshold = Math.trunc(maxBufferedAmount / 8);
        glob.dc.send(
            JSON.stringify({
                type: "start-sending",
                payload: {
                    name,
                    type,
                    size,
                    length,
                },
            })
        );

        function lowThresholdHandler() {
            glob.dc!.removeEventListener(
                "bufferedamountlow",
                lowThresholdHandler
            );
            queueHandler();
        }

        async function queueHandler() {
            while (current.count < length) {
                if (glob.dc!.bufferedAmount > maxBufferedAmount) {
                    glob.dc!.addEventListener(
                        "bufferedamountlow",
                        lowThresholdHandler
                    );
                    return;
                }
                const begin = current.count * maxMessageSize;
                const end = begin + maxMessageSize;
                const chunk = await file.slice(begin, end).arrayBuffer();
                glob.dc!.send(chunk);
                current.count++;
                current.progress = current.count / current.length;
            }

            glob.dc!.send(
                JSON.stringify({
                    type: "complete-sending",
                })
            );

            current.status = "completed";
            glob.isSending.value = false;
            setTimeout(nextFile);
        }

        queueHandler();
    }

    return { sendFile };
}
