export class MessageEvent {
    type: 'message' | string;
    subtype: 'bot_message' | string;
    text: string;
    user: string;
    channel: string;
}