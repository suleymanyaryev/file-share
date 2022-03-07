import { ref } from "vue";
import type { Glob, HistoryItem } from "@/types";

export default function (wsUrl: string): Glob {
    return {
        ws: new WebSocket(wsUrl),
        pc: null,
        dc: null,
        isConnected: ref(false),
        isSending: ref(false),
        isReceiving: ref(false),
        history: ref<HistoryItem[]>([]),
        queue: ref<File[]>([]),
    };
}
