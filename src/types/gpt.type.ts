
export interface MessageItem {
    role: string;
    content: string;
}

export interface ImageItem {
    role: string;
    content: Array<{ url: string }>;
}

export enum HistoryType {
    chat = "chat",
    image = "image"
}

export interface MessageHistory {
    key: string;
    type: HistoryType;
    title: string;
    saveDate: string;
    history: Array<MessageItem | ImageItem>;
}

export interface EditMessageHistory extends MessageHistory {
    edit: Boolean;
}