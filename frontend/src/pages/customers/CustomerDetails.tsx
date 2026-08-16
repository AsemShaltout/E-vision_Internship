import { useState } from "react"
import { ArrowLeft, ExternalLink, Plus } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useFetchCustomer } from "./services/quiries"
import { useFetchAccounts } from "@/pages/accounts/services/queries"
import { AccountFormSheet } from "@/pages/accounts/components/AccountFormSheet"

const CustomerDetails = () => {
    const id = Number(useParams().id)
    const { data: customer, isLoading, isError } = useFetchCustomer(id)
    const { data: accounts = [] } = useFetchAccounts(id)
    const [accountFormOpen, setAccountFormOpen] = useState(false)

    if (isLoading) return <p className="p-6 text-muted-foreground">Loading customer...</p>
    if (isError || !customer) return <p className="p-6 text-destructive">Customer could not be loaded.</p>

    const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0)

    return (
        <div className="p-6">
            <Button asChild variant="ghost" className="mb-4"><Link to="/customers"><ArrowLeft /> Back to customers</Link></Button>
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-950 to-cyan-800 p-6 text-white">
                    <div>
                        <h1 className="text-2xl font-semibold">{customer.firstName} {customer.lastName}</h1>
                        <p className="text-sm text-white/70">Customer #{customer.id} · {accounts.length} account(s)</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right"><p className="text-xs uppercase text-white/60">Total holdings</p><p className="text-xl font-semibold">{totalBalance.toFixed(2)}</p></div>
                        <Button variant="secondary" onClick={() => setAccountFormOpen(true)}><Plus /> New account</Button>
                    </div>
                </div>
                <dl className="grid gap-4 p-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div><dt className="text-muted-foreground">Email</dt><dd>{customer.email}</dd></div>
                    <div><dt className="text-muted-foreground">Phone</dt><dd>{customer.phone || "—"}</dd></div>
                    <div><dt className="text-muted-foreground">Address</dt><dd>{customer.address || "—"}</dd></div>
                    <div><dt className="text-muted-foreground">Date of birth</dt><dd>{customer.dob || "—"}</dd></div>
                    <div><dt className="text-muted-foreground">National ID</dt><dd>{customer.nationalId}</dd></div>
                    <div><dt className="text-muted-foreground">Customer since</dt><dd>{new Date(customer.createdAt).toLocaleDateString()}</dd></div>
                </dl>
            </div>

            <div className="mt-5 rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Linked accounts</h2><Button size="sm" onClick={() => setAccountFormOpen(true)}><Plus /> Open account</Button></div>
                {accounts.length === 0 && <p className="py-6 text-center text-muted-foreground">This customer has no accounts yet.</p>}
                <div className="grid gap-3 md:grid-cols-2">
                    {accounts.map((account) => <Link key={account.id} to={`/accounts/${account.id}`} className="rounded-lg border p-4 transition hover:bg-muted/40">
                        <div className="flex justify-between"><span className="font-mono text-xs text-muted-foreground">{account.accountNumber}</span><span className="text-xs font-medium">{account.status}</span></div>
                        <p className="mt-2 text-xl font-semibold">{Number(account.balance).toFixed(2)} {account.currency}</p>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{account.accountType}</span><span className="flex items-center gap-1">Open account <ExternalLink className="size-3" /></span></div>
                    </Link>)}
                </div>
            </div>

            <AccountFormSheet open={accountFormOpen} customerId={customer.id} onOpenChange={setAccountFormOpen} />
        </div>
    )
}

export default CustomerDetails
