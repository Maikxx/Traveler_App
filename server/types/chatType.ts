export interface MessageType {
    messageById: String,
    messageText: String,
    sentByWho?: 'them' | 'me',
}

export interface ChatType {
    _id: string,
    ownUserId?: string,
    chatWithId?: string,
    messages?: MessageType[],
}
