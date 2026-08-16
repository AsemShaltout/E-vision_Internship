import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Overview from "@/pages/overview/Overview";
import Customers from "@/pages/customers/Customers";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { index: true, element: <Navigate to="/overview" replace/> },
            { path: "customers", element: <Customers /> },
            { path: "overview", element: <Overview /> },
        ],
    },
]);