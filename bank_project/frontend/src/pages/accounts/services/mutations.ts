import axiosInstance from "@/network/axiosInstance"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Account, AccountCreateRequest, AccountUpdateRequest } from "../schema/account"

const useRefreshAccounts = () => {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: ["accounts"] })
}

export const useCreateAccount = () => {
    const refresh = useRefreshAccounts()
    return useMutation({
        mutationFn: async (request: AccountCreateRequest) => {
            const response = await axiosInstance.post<Account>("/accounts", request)
            return response.data
        },
        onSuccess: refresh,
    })
}

export const useUpdateAccount = () => {
    const refresh = useRefreshAccounts()
    return useMutation({
        mutationFn: async ({ id, request }: { id: number; request: AccountUpdateRequest }) => {
            const response = await axiosInstance.put<Account>(`/accounts/${id}`, request)
            return response.data
        },
        onSuccess: refresh,
    })
}

export const useCloseAccount = () => {
    const refresh = useRefreshAccounts()
    return useMutation({
        mutationFn: async (id: number) => axiosInstance.delete(`/accounts/${id}`),
        onSuccess: refresh,
    })
}

