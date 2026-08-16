export type Customer = {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string | null
    address: string | null
    dob: string | null
    nationalId: string
    createdAt: string
    updatedAt: string
}

export type CustomerRequest = {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    dob: string
    nationalId: string
}

export const emptyCustomerRequest: CustomerRequest = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    nationalId: "",
}

