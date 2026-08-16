import axiosInstance from "@/network/axiosInstance"
import { useQuery } from "@tanstack/react-query"
import type { Transaction } from "../schema/transaction"

export const useFetchTransactions = (accountId: number) => useQuery({
    queryKey: ["transactions", accountId],
    queryFn: async (): Promise<Transaction[]> => {
        const response = await axiosInstance.get(`/accounts/${accountId}/transactions`)
        return response.data
    },
    enabled: Number.isFinite(accountId),
})

