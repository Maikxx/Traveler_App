export interface SessionType {
    userId?: string
    lastMatchId?: string
    error?: {
        code: number
        title: string
    } | null
    destroy: (error: any) => void
}
