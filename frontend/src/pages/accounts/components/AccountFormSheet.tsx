import { useEffect, useState, type FormEvent } from "react"
import { isAxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useFetchCustomers } from "@/pages/customers/services/quiries"
import { useCreateAccount, useUpdateAccount } from "../services/mutations"
import type { Account, AccountStatus, AccountType } from "../schema/account"

type Props = {
    open: boolean
    account?: Account | null
    customerId?: number
    onOpenChange: (open: boolean) => void
}

export function AccountFormSheet({ open, account, customerId, onOpenChange }: Props) {
    const { data: customers = [] } = useFetchCustomers()
    const [selectedCustomerId, setSelectedCustomerId] = useState(customerId ?? 0)
    const [accountType, setAccountType] = useState<AccountType>("SAVINGS")
    const [currency, setCurrency] = useState("EGP")
    const [status, setStatus] = useState<AccountStatus>("ACTIVE")
    const [error, setError] = useState("")
    const createAccount = useCreateAccount()
    const updateAccount = useUpdateAccount()
    const isPending = createAccount.isPending || updateAccount.isPending

    useEffect(() => {
        setSelectedCustomerId(customerId ?? account?.customerId ?? 0)
        setAccountType(account?.accountType ?? "SAVINGS")
        setCurrency(account?.currency ?? "EGP")
        setStatus(account?.status ?? "ACTIVE")
        setError("")
    }, [account, customerId, open])

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        try {
            if (account) {
                await updateAccount.mutateAsync({ id: account.id, request: { accountType, currency, status } })
            } else {
                await createAccount.mutateAsync({ customerId: selectedCustomerId, accountType, currency })
            }
            onOpenChange(false)
        } catch (requestError) {
            setError(isAxiosError(requestError)
                ? requestError.response?.data?.message ?? "Could not save account."
                : "Could not save account.")
        }
    }

    const selectClass = "h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{account ? "Edit account" : "Open account"}</SheetTitle>
                    <SheetDescription>Balance starts at 0.00. Use Deposit after creating the account.</SheetDescription>
                </SheetHeader>
                <form onSubmit={submit} className="flex flex-1 flex-col">
                    <div className="grid gap-4 px-4">
                        {!account && !customerId && (
                            <label className="grid gap-1.5 text-sm font-medium">Customer
                                <select required className={selectClass} value={selectedCustomerId || ""} onChange={(e) => setSelectedCustomerId(Number(e.target.value))}>
                                    <option value="">Select customer</option>
                                    {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
                                </select>
                            </label>
                        )}
                        <label className="grid gap-1.5 text-sm font-medium">Account type
                            <select className={selectClass} value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}>
                                <option value="SAVINGS">Savings</option>
                                <option value="CURRENT">Current</option>
                            </select>
                        </label>
                        <label className="grid gap-1.5 text-sm font-medium">Currency
                            <Input required minLength={3} maxLength={3} value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
                        </label>
                        {account && (
                            <label className="grid gap-1.5 text-sm font-medium">Status
                                <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as AccountStatus)}>
                                    <option value="ACTIVE">Active</option>
                                    <option value="FROZEN">Frozen</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </label>
                        )}
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={isPending || (!account && !selectedCustomerId)}>{isPending ? "Saving..." : account ? "Save changes" : "Open account"}</Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
