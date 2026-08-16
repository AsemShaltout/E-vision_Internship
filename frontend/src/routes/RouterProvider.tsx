import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Overview from "@/pages/overview/Overview";
import Customers from "@/pages/customers/Customers";
import CustomerDetails from "@/pages/customers/CustomerDetails";
import Accounts from "@/pages/accounts/Accounts";
import AccountDetails from "@/pages/accounts/AccountDetails";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { index: true, element: <Navigate to="/overview" replace/> },
            { path: "customers", element: <Customers /> },
            { path: "customers/:id", element: <CustomerDetails /> },
            { path: "accounts", element: <Accounts /> },
            { path: "accounts/:id", element: <AccountDetails /> },
            { path: "overview", element: <Overview /> },
        ],
    },
]);
