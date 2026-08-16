import { useEffect, useState, type FormEvent } from "react"
import { isAxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useCreateCustomer, useUpdateCustomer } from "../services/mutations"
import {
    emptyCustomerRequest,
    type Customer,
    type CustomerRequest,
} from "../schema/customer"

type Props = {
    open: boolean
    customer: Customer | null
    onOpenChange: (open: boolean) => void
}

const fields: Array<{
    name: keyof CustomerRequest
    label: string
    type?: string
    required?: boolean
}> = [
    { name: "firstName", label: "First name", required: true },
    { name: "lastName", label: "Last name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone" },
    { name: "address", label: "Address" },
    { name: "dob", label: "Date of birth", type: "date" },
    { name: "nationalId", label: "National ID", required: true },
]

export function CustomerFormSheet({ open, customer, onOpenChange }: Props) {
    const [form, setForm] = useState<CustomerRequest>(emptyCustomerRequest)
    const [error, setError] = useState("")
    const createCustomer = useCreateCustomer()
    const updateCustomer = useUpdateCustomer()
    const isPending = createCustomer.isPending || updateCustomer.isPending

    useEffect(() => {
        setError("")
        setForm(customer ? {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone ?? "",
            address: customer.address ?? "",
            dob: customer.dob ?? "",
            nationalId: customer.nationalId,
        } : emptyCustomerRequest)
    }, [customer, open])

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")

        try {
            if (customer) {
                await updateCustomer.mutateAsync({ id: customer.id, request: form })
            } else {
                await createCustomer.mutateAsync(form)
            }
            onOpenChange(false)
        } catch (requestError) {
            if (isAxiosError(requestError)) {
                setError(requestError.response?.data?.message ?? "The request could not be completed.")
            } else {
                setError("The request could not be completed.")
            }
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{customer ? "Edit customer" : "Add customer"}</SheetTitle>
                    <SheetDescription>
                        {customer ? "Update the customer information." : "Create a new bank customer."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={submit} className="flex flex-1 flex-col">
                    <div className="grid gap-4 px-4">
                        {fields.map((field) => (
                            <label key={field.name} className="grid gap-1.5 text-sm font-medium">
                                {field.label}
                                <Input
                                    type={field.type ?? "text"}
                                    required={field.required}
                                    value={form[field.name]}
                                    onChange={(event) => setForm((current) => ({
                                        ...current,
                                        [field.name]: event.target.value,
                                    }))}
                                />
                            </label>
                        ))}

                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>

                    <SheetFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : customer ? "Save changes" : "Create customer"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
