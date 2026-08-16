import axiosInstance from "@/network/axiosInstance"
import { useQuery } from "@tanstack/react-query"
import type { Account } from "../schema/account"

export const useFetchAccounts = (customerId?: number) => useQuery({
    queryKey: ["accounts", customerId ?? "all"],
    queryFn: async (): Promise<Account[]> => {
        const response = await axiosInstance.get("/accounts", {
            params: customerId ? { customerId } : undefined,
        })
        return response.data
    },
})

export const useFetchAccount = (id: number) => useQuery({
    queryKey: ["accounts", "detail", id],
    queryFn: async (): Promise<Account> => {
        const response = await axiosInstance.get(`/accounts/${id}`)
        return response.data
    },
    enabled: Number.isFinite(id),
})

