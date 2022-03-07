import type { Ref } from "vue";

export interface Glob {
    ws: WebSocket;
    pc: RTCPeerConnection | null;
    dc: RTCDataChannel | null;
    isConnected: Ref<boolean>;
    isSending: Ref<boolean>;
    isReceiving: Ref<boolean>;
    history: Ref<HistoryItem[]>;
    queue: Ref<File[]>;
}

export type HistoryItemType =
    | "in-progress"
    | "paused"
    | "canceled"
    | "completed";

export interface HistoryItem {
    type: "in" | "out";
    status: HistoryItemType;
    filename: string;
    filetype: string;
    filesize: number;
    length: number;
    count: number;
    progress: number;
}
