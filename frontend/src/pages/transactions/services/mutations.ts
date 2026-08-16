import axiosInstance from "@/network/axiosInstance"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Transaction, TransactionRequest, TransactionType } from "../schema/transaction"

export const useCreateTransaction = (accountId: number, type: TransactionType) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (request: TransactionRequest) => {
            const operation = type === "DEPOSIT" ? "deposit" : "withdraw"
            const response = await axiosInstance.post<Transaction>(`/accounts/${accountId}/${operation}`, request)
            return response.data
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["transactions", accountId] }),
                queryClient.invalidateQueries({ queryKey: ["accounts"] }),
            ])
        },
    })
}

