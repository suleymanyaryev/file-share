import type { Glob } from "@/types";
import { servers } from "@/utils/constants";

export default function (
    glob: Glob,
    receiveFile: (e: MessageEvent<string | ArrayBuffer>) => void,
    onConnectionStateChange: (e: Event) => void,
    onLocalIceCandidate: (e: RTCPeerConnectionIceEvent) => void
) {
    function onRemoteAnswer(data: any) {
        if (!glob.pc) {
            return;
        }
        glob.pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }

    function onRemoteIceCandidate(data: any) {
        if (!glob.pc) {
            return;
        }
        glob.pc.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
    }

    function onRemoteDataChannel(e: RTCDataChannelEvent) {
        glob.dc = e.channel;
        glob.dc.binaryType = "arraybuffer";

        glob.dc.onopen = () => {
            console.log("remote dc opened");
        };

        glob.dc.onmessage = async (e: MessageEvent<string | ArrayBuffer>) => {
            receiveFile(e);
        };

        glob.dc.onerror = (e) => {
            console.log("remote dc error");
            console.log(e);
        };

        glob.dc.onclose = () => {
            console.log("remote dc close");
            glob.pc!.close();
        };
    }

    async function onRemoteOffer({ offer }) {
        glob.pc = new RTCPeerConnection(servers);
        glob.pc.ondatachannel = onRemoteDataChannel;

        await glob.pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await glob.pc.createAnswer();
        await glob.pc.setLocalDescription(answer);

        glob.ws.send(
            JSON.stringify({
                type: "client-answer",
                payload: {
                    answer,
                },
            })
        );

        glob.pc.onicecandidate = onLocalIceCandidate;
        glob.pc.onconnectionstatechange = onConnectionStateChange;
    }

    return {
        onRemoteAnswer,
        onRemoteIceCandidate,
        onRemoteOffer,
    };
}
