export interface sessionType {
    userId?: string
    error?: {
        code: number
        title: string
    } | null
    destroy: (error: any) => void
}
