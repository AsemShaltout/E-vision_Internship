import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, Pencil, Plus, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFetchAccounts } from "./services/queries"
import { useCloseAccount } from "./services/mutations"
import type { Account } from "./schema/account"
import { AccountFormSheet } from "./components/AccountFormSheet"

const money = (amount: number, currency: string) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
}).format(amount)

const statusStyle: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    FROZEN: "bg-amber-100 text-amber-700",
    CLOSED: "bg-rose-100 text-rose-700",
}

const Accounts = () => {
    const { data: accounts = [], isLoading, isError } = useFetchAccounts()
    const closeAccount = useCloseAccount()
    const [formOpen, setFormOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

    const close = (account: Account) => {
        if (account.status !== "CLOSED" && window.confirm(`Close account ${account.accountNumber}?`)) {
            closeAccount.mutate(account.id)
        }
    }

    return (
        <div className="p-6">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Accounts</h1>
                    <p className="text-sm text-muted-foreground">Manage balances, status, and transactions.</p>
                </div>
                <Button onClick={() => { setSelectedAccount(null); setFormOpen(true) }}><Plus /> Open account</Button>
            </div>

            {isLoading && <p className="text-muted-foreground">Loading accounts...</p>}
            {isError && <p className="text-destructive">Could not load accounts. Make sure the backend is running.</p>}
            {!isLoading && !isError && accounts.length === 0 && <p className="rounded-xl border p-8 text-center text-muted-foreground">No accounts yet.</p>}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {accounts.map((account) => (
                    <div key={account.id} className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-mono text-xs text-muted-foreground">{account.accountNumber}</p>
                                <p className="mt-2 text-2xl font-semibold">{money(account.balance, account.currency)}</p>
                            </div>
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyle[account.status]}`}>{account.status}</span>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                            <span>{account.accountType}</span><span>Customer #{account.customerId}</span>
                        </div>
                        <div className="mt-5 flex gap-2 border-t pt-4">
                            <Button asChild size="sm"><Link to={`/accounts/${account.id}`}><Eye /> View</Link></Button>
                            <Button size="sm" variant="outline" onClick={() => { setSelectedAccount(account); setFormOpen(true) }}><Pencil /> Edit</Button>
                            <Button size="sm" variant="destructive" disabled={account.status === "CLOSED" || closeAccount.isPending} onClick={() => close(account)}><XCircle /> Close</Button>
                        </div>
                    </div>
                ))}
            </div>

            <AccountFormSheet open={formOpen} account={selectedAccount} onOpenChange={setFormOpen} />
        </div>
    )
}

export default Accounts
