import { useState } from "react"
import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useFetchAccount } from "./services/queries"
import { useFetchTransactions } from "@/pages/transactions/services/queries"
import { TransactionSheet } from "@/pages/transactions/components/TransactionSheet"
import type { TransactionType } from "@/pages/transactions/schema/transaction"

const money = (amount: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)

const AccountDetails = () => {
    const id = Number(useParams().id)
    const { data: account, isLoading, isError } = useFetchAccount(id)
    const { data: transactions = [] } = useFetchTransactions(id)
    const [transactionType, setTransactionType] = useState<TransactionType | null>(null)

    if (isLoading) return <p className="p-6 text-muted-foreground">Loading account...</p>
    if (isError || !account) return <p className="p-6 text-destructive">Account could not be loaded.</p>

    return (
        <div className="p-6">
            <Button asChild variant="ghost" className="mb-4"><Link to="/accounts"><ArrowLeft /> Back to accounts</Link></Button>
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-xl bg-gradient-to-r from-slate-950 to-cyan-800 p-6 text-white shadow-sm">
                    <p className="text-xs uppercase text-white/70">Available balance</p>
                    <p className="mt-1 text-4xl font-semibold">{money(account.balance, account.currency)}</p>
                    <p className="mt-3 font-mono text-xs text-white/70">{account.accountNumber}</p>
                    <div className="mt-6 flex gap-2">
                        <Button disabled={account.status !== "ACTIVE"} onClick={() => setTransactionType("DEPOSIT")}><ArrowDownLeft /> Deposit</Button>
                        <Button disabled={account.status !== "ACTIVE"} variant="secondary" onClick={() => setTransactionType("WITHDRAWAL")}><ArrowUpRight /> Withdraw</Button>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h2 className="font-semibold">Account info</h2>
                    <dl className="mt-4 grid gap-3 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Customer</dt><dd>#{account.customerId}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd>{account.accountType}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd>{account.status}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Currency</dt><dd>{account.currency}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Opened</dt><dd>{new Date(account.createdAt).toLocaleDateString()}</dd></div>
                    </dl>
                </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="border-b px-5 py-4"><h2 className="font-semibold">Transaction history</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-3">Type</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">When</th><th className="px-5 py-3 text-right">Amount</th><th className="px-5 py-3 text-right">Balance after</th></tr></thead>
                        <tbody className="divide-y">
                            {transactions.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No transactions yet.</td></tr>}
                            {[...transactions].reverse().map((item) => <tr key={item.id}>
                                <td className="px-5 py-3 font-medium">{item.type}</td>
                                <td className="px-5 py-3 text-muted-foreground">{item.description || "—"}</td>
                                <td className="px-5 py-3 text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</td>
                                <td className={`px-5 py-3 text-right font-medium ${item.type === "DEPOSIT" ? "text-emerald-600" : "text-rose-600"}`}>{item.type === "DEPOSIT" ? "+" : "−"}{money(item.amount, account.currency)}</td>
                                <td className="px-5 py-3 text-right">{money(item.balanceAfter, account.currency)}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            {transactionType && <TransactionSheet open accountId={account.id} accountNumber={account.accountNumber} type={transactionType} onOpenChange={(open) => !open && setTransactionType(null)} />}
        </div>
    )
}

export default AccountDetails
