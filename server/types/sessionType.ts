// TypeScript interface for express-session on top of the express.Request interface.

export interface SessionType {
    userId?: string
    lastMatchId?: string
    error?: {
        code: number
        title: string
    } | null
    destroy: (error: any) => void
}
