export type AccountType = "SAVINGS" | "CURRENT"
export type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED"

export type Account = {
    id: number
    customerId: number
    accountNumber: string
    accountType: AccountType
    balance: number
    currency: string
    status: AccountStatus
    createdAt: string
}

export type AccountCreateRequest = {
    customerId: number
    accountType: AccountType
    currency: string
}

export type AccountUpdateRequest = {
    accountType: AccountType
    currency: string
    status: AccountStatus
}

