export interface MessageType {
    messageById: String,
    messageText: String,
}

export interface ChatType {
    _id: string,
    ownUserId?: string,
    chatWithId?: string,
    messages?: MessageType[],
}
