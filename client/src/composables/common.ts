import type { Glob } from "@/types";

export default function (glob: Glob) {
    function onConnectionStateChange(e: Event) {
        const target = e.target as RTCPeerConnection;
        if (target !== glob.pc) {
            return;
        }

        if (target.connectionState === "connected") {
            glob.isConnected.value = true;
        }

        if (
            target.connectionState === "disconnected" ||
            target.connectionState === "failed"
        ) {
            glob.isConnected.value = false;
        }
    }

    function onLocalIceCandidate(e: RTCPeerConnectionIceEvent) {
        if (e.candidate) {
            glob.ws.send(
                JSON.stringify({
                    type: "client-ice-candidate",
                    payload: {
                        iceCandidate: e.candidate,
                    },
                })
            );
        }
    }

    return {
        onConnectionStateChange,
        onLocalIceCandidate,
    };
}
