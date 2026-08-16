export type TransactionType = "DEPOSIT" | "WITHDRAWAL"

export type Transaction = {
    id: number
    accountId: number
    type: TransactionType
    amount: number
    balanceAfter: number
    description: string | null
    timestamp: string
}

export type TransactionRequest = {
    amount: number
    description: string
}

