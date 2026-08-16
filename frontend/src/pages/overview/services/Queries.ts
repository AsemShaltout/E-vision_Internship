import axiosInstance from "@/network/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchCustomers = async () => {
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


const fetchAccounts = async () => {
    const response = await axiosInstance.get("/accounts");
    return response.data;
};

export const useFetchAccounts = () => {
    return useQuery({
        queryKey: ["accounts"],
        queryFn: fetchAccounts,
        staleTime: 1 * 60 * 1000,
    });
};