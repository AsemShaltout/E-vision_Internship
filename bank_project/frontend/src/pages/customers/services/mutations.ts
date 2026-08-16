import axiosInstance from "@/network/axiosInstance"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Customer, CustomerRequest } from "../schema/customer"

export const useCreateCustomer = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: CustomerRequest) => {
            const response = await axiosInstance.post<Customer>("/customers", request)
            return response.data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    })
}

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, request }: { id: number; request: CustomerRequest }) => {
            const response = await axiosInstance.put<Customer>(`/customers/${id}`, request)
            return response.data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    })
}

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => axiosInstance.delete(`/customers/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    })
}
