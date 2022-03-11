import type { Glob } from "@/types";
import { servers } from "@/utils/constants";

export default function (
    glob: Glob,
    receiveFile: (e: MessageEvent<string | ArrayBuffer>) => void,
    onConnectionStateChange: (e: Event) => void,
    onLocalIceCandidate: (e: RTCPeerConnectionIceEvent) => void,
    reset: () => void
) {
    async function initConnection() {
        glob.pc = new RTCPeerConnection(servers);

        onLocalDataChannel();

        const offer = await glob.pc.createOffer();
        await glob.pc.setLocalDescription(offer);

        glob.ws.send(
            JSON.stringify({
                type: "client-offer",
                payload: {
                    offer,
                },
            })
        );

        glob.pc.onicecandidate = onLocalIceCandidate;
        glob.pc.onconnectionstatechange = onConnectionStateChange;
    }

    async function onLocalDataChannel() {
        glob.dc = glob.pc!.createDataChannel("file-share");
        glob.dc.binaryType = "arraybuffer";

        glob.dc.onopen = () => {
            console.log("local dc opened");
        };

        glob.dc.onmessage = async (e: MessageEvent<string | ArrayBuffer>) => {
            receiveFile(e);
        };

        glob.dc.onerror = (e) => {
            console.log("local dc error");
            console.log(e);
        };

        glob.dc.onclose = () => {
            console.log("local dc closed");
            glob.pc!.close();
            reset();
        };
    }

    return {
        initConnection,
    };
}
