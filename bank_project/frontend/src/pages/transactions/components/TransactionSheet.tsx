import { useState, type FormEvent } from "react"
import { isAxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCreateTransaction } from "../services/mutations"
import type { TransactionType } from "../schema/transaction"

type Props = {
    open: boolean
    accountId: number
    accountNumber: string
    type: TransactionType
    onOpenChange: (open: boolean) => void
}

export function TransactionSheet({ open, accountId, accountNumber, type, onOpenChange }: Props) {
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")
    const transaction = useCreateTransaction(accountId, type)
    const label = type === "DEPOSIT" ? "Deposit" : "Withdraw"

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        try {
            await transaction.mutateAsync({ amount: Number(amount), description })
            setAmount("")
            setDescription("")
            onOpenChange(false)
        } catch (requestError) {
            setError(isAxiosError(requestError)
                ? requestError.response?.data?.message ?? requestError.response?.data?.detail ?? `${label} failed.`
                : `${label} failed.`)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{label} funds</SheetTitle>
                    <SheetDescription>{accountNumber}</SheetDescription>
                </SheetHeader>
                <form onSubmit={submit} className="flex flex-1 flex-col">
                    <div className="grid gap-4 px-4">
                        <label className="grid gap-1.5 text-sm font-medium">Amount
                            <Input type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </label>
                        <label className="grid gap-1.5 text-sm font-medium">Description
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
                        </label>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={transaction.isPending}>{transaction.isPending ? "Processing..." : `Confirm ${label.toLowerCase()}`}</Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

