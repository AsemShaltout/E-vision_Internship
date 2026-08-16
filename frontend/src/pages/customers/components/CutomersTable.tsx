import {
    createColumnHelper,
    tableFeatures,
    useTable,
} from '@tanstack/react-table'
import { useFetchCustomers } from '../services/quiries'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { Customer } from '../schema/customer'
import { useDeleteCustomer } from '../services/mutations'
import { CustomerFormSheet } from './CustomerFormSheet'

const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, Customer>()

export function CustomersTable() {
    const [formOpen, setFormOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const { data: allCustomers, isLoading, isError } = useFetchCustomers()
    const deleteCustomer = useDeleteCustomer()

    const edit = (customer: Customer) => {
        setSelectedCustomer(customer)
        setFormOpen(true)
    }

    const remove = (customer: Customer) => {
        if (window.confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) {
            deleteCustomer.mutate(customer.id)
        }
    }

    const columns = columnHelper.columns([
        columnHelper.accessor('firstName', {
            header: 'First Name',
            cell: (info) => <span className="font-medium capitalize">{info.getValue()}</span>,
        }),
        columnHelper.accessor('lastName', {
            header: 'Last Name',
            cell: (info) => <span className="capitalize text-muted-foreground">{info.getValue()}</span>,
        }),
        columnHelper.accessor('nationalId', {
            header: 'National ID',
            cell: (info) => <span className="tabular-nums text-muted-foreground">{info.getValue()}</span>,
        }),
        columnHelper.accessor('phone', {
            header: 'Phone',
            cell: (info) => <span className="tabular-nums text-muted-foreground">{info.getValue() || '—'}</span>,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link
                        to={`/customers/${row.original.id}`}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="View customer"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <button
                        onClick={() => edit(row.original)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Edit customer"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => remove(row.original)}
                        disabled={deleteCustomer.isPending}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                        title="Delete customer"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        }),
    ])

    const table = useTable(
        {
            key: 'customers-table',
            features,
            columns,
            data: allCustomers ?? [],
        },
        (state) => state,
    )

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Table header bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                    <p className="text-sm font-semibold text-foreground">All Customers</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{allCustomers?.length ?? 0} records</p>
                </div>
                <Button onClick={() => {
                    setSelectedCustomer(null)
                    setFormOpen(true)
                }}>
                    <Plus /> Add customer
                </Button>
            </div>

            {/* Scrollable table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-border bg-muted/40">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading && (
                            <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Loading customers...</td></tr>
                        )}
                        {isError && (
                            <tr><td colSpan={6} className="px-5 py-8 text-center text-destructive">Could not load customers. Make sure the backend is running on port 9090.</td></tr>
                        )}
                        {!isLoading && !isError && table.getRowModel().rows.length === 0 && (
                            <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No customers yet.</td></tr>
                        )}
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="transition-colors hover:bg-muted/30"
                            >
                                {row.getAllCells().map((cell) => (
                                    <td key={cell.id} className="px-5 py-3.5">
                                        <table.FlexRender cell={cell} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CustomerFormSheet
                open={formOpen}
                customer={selectedCustomer}
                onOpenChange={setFormOpen}
            />
        </div>
    )
}
