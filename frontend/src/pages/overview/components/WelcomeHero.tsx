import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFetchAccounts, useFetchCustomers } from "../services/Queries";
import { useMemo } from "react";

const WelcomeSection = () => {

    const { data: allCustomers } = useFetchCustomers()
    const { data: allAccounts } = useFetchAccounts()

    const stats = useMemo(() => {
        return [
            { title: "All Customers", value: allCustomers?.length ?? 0, id: 1 },
            { title: "All Accounts", value: allAccounts?.length ?? 0, id: 2 },
        ]
    }, [allCustomers, allAccounts])

    console.log(allCustomers, allAccounts);
    return (
        <div className="space-y-6 bg-[#000] max-h-[30vh] w-full">
            <div className="overflow-hidden rounded-2xl bg-gradient-brand px-6 py-8 text-primary-foreground shadow-lift lg:px-10 lg:py-10">
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                    Tuesday, 11 August 2026
                </p>
                <h1 className="mt-2 max-w-xl text-3xl font-semibold lg:text-4xl">
                    Good morning, Sara. The counter is open.
                </h1>
                <p className="mt-3 max-w-lg text-sm opacity-80">
                    Manage customer records, open accounts and post deposits or
                    withdrawals — every balance change is logged to the transaction
                    ledger.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="secondary" asChild>
                        <Link to="/customers">
                            Open customers <ArrowRight />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                        <Link to="/customers/add">Add customer</Link>
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {
                    stats.map((item) => (
                        <div key={item.id} className="bg-[red] p-1">
                            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                                {item.title}
                            </p>
                            <p className="mt-3 max-w-lg text-sm opacity-80">
                                {item.value}
                            </p>
                        </div>
                    ))
                }
            </div>

        </div>
    );
};

export default WelcomeSection;