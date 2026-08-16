import {
    createColumnHelper,
    tableFeatures,
    useTable,
} from '@tanstack/react-table'
import { useFetchCustomers } from '../services/quiries'
import { Pencil, Trash2 } from 'lucide-react'

type Customer = {
    firstName: string
    lastName: string
    nationalId: string
    phone: string
    email: string
}

const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, Customer>()

const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: (info) => (
            <span className="font-medium capitalize text-foreground">
                {info.getValue()}
            </span>
        ),
    }),
    columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        header: () => 'Last Name',
        cell: (info) => (
            <span className="capitalize text-muted-foreground">
                {info.getValue()}
            </span>
        ),
    }),
    columnHelper.accessor('nationalId', {
        header: () => 'National ID',
        cell: (info) => (
            <span className="tabular-nums text-muted-foreground">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('phone', {
        header: 'Phone',
        cell: (info) => (
            <span className="tabular-nums text-muted-foreground">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => (
            <span className="tabular-nums text-muted-foreground">{info.getValue()}</span>
        ),
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => console.log('edit', row.original)}
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Edit customer"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    onClick={() => console.log('delete', row.original)}
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                    title="Delete customer"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        ),
    }),
])

export function CustomersTable() {

    const { data: allCustomers } = useFetchCustomers()

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
        </div>
    )
}
