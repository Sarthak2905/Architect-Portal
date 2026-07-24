import { Building2, Users, IndianRupee } from "lucide-react";
import { StatCard } from "../../components/owner/StatCard";
import { PendingPaymentsList } from "../../components/owner/PendingPaymentsList";
import { ActivityFeed } from "../../components/owner/ActivityFeed";
import {
    useDashboardSummary,
    usePendingPayments,
    useRecentActivity,
} from "../../api/hooks/useDashboard";
import { formatCurrency } from "../../utils/formatters";

export const DashboardPage = () => {
    const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
    const { data: pendingPayments, isLoading: paymentsLoading } = usePendingPayments(5);
    const { data: activity, isLoading: activityLoading } = useRecentActivity(10);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-6">
            <header>
                <h1 className="text-2xl md:text-3xl">Dashboard</h1>
                <p className="text-muted mt-1">Overview of all active projects and payments</p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    label="Active Projects"
                    value={summaryLoading ? "—" : summary?.activeProjectsCount ?? 0}
                    icon={Building2}
                />
                <StatCard
                    label="Total Clients"
                    value={summaryLoading ? "—" : summary?.totalClients ?? 0}
                    icon={Users}
                />
                <StatCard
                    label="Balance Due"
                    value={summaryLoading ? "—" : formatCurrency(summary?.totalOutstandingBalance)}
                    tone="warning"
                    icon={IndianRupee}
                />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                    <h2 className="text-lg">Pending Payments</h2>
                    <PendingPaymentsList payments={pendingPayments} isLoading={paymentsLoading} />
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-lg">Recent Activity</h2>
                    <ActivityFeed activity={activity} isLoading={activityLoading} />
                </div>
            </section>
        </div>
    );
};