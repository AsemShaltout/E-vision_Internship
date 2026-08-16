import axiosInstance from "@/network/axiosInstance";
import type { Customer } from "../schema/customer";
import { useQuery } from "@tanstack/react-query";

const fetchCustomers = async (): Promise<Customer[]> => {
    const response = await axiosInstance.get("/customers");
    return response.data;
};

export const useFetchCustomers = () => {
    return useQuery({
        queryKey: ["customers"],
        queryFn: fetchCustomers,
        staleTime: 1 * 60 * 1000,
    });
};
