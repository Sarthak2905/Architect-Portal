import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { ClientForm } from "../../components/owner/ClientForm";
import { ClientCard } from "../../components/owner/ClientCard";
import {
    useClients,
    useCreateClient,
    useUpdateClient,
    useDeactivateClient,
    useReactivateClient,
} from "../../api/hooks/useClients";

export const ClientsPage = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("active");
    const [modalMode, setModalMode] = useState(null); // null | "create" | "edit"
    const [editingClient, setEditingClient] = useState(null);

    const { data, isLoading } = useClients({ search, page, status: statusFilter });
    const createClient = useCreateClient();
    const updateClient = useUpdateClient();
    const deactivateClient = useDeactivateClient();
    const reactivateClient = useReactivateClient();

    const closeModal = () => {
        setModalMode(null);
        setEditingClient(null);
    };

    const handleCreate = async (values) => {
        await createClient.mutateAsync(values);
        closeModal();
    };

    const handleUpdate = async (values) => {
        await updateClient.mutateAsync({ id: editingClient._id, payload: values });
        closeModal();
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col gap-5">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl">Clients</h1>
                    <p className="text-muted mt-1">{data?.pagination?.total ?? 0} total</p>
                </div>
                <Button onClick={() => setModalMode("create")}>
                    <Plus size={16} /> Add client
                </Button>
            </header>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-md border border-border bg-white text-sm focus:border-primary transition-colors"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="rounded-md border border-border bg-white px-3 py-2.5 text-sm"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="all">All</option>
                </select>
            </div>

            {isLoading ? (
                <p className="text-sm text-muted text-center py-8">Loading clients...</p>
            ) : !data?.clients?.length ? (
                <p className="text-sm text-muted text-center py-8">No clients found.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.clients.map((client) => (
                        <ClientCard
                            key={client._id}
                            client={client}
                            onEdit={(c) => {
                                setEditingClient(c);
                                setModalMode("edit");
                            }}
                            onDeactivate={(id) => deactivateClient.mutate(id)}
                            onReactivate={(id) => reactivateClient.mutate(id)}
                        />
                    ))}
                </div>
            )}

            {data?.pagination?.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="p-2 rounded-md border border-border disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-muted">
                        Page {data.pagination.page} of {data.pagination.totalPages}
                    </span>
                    <button
                        disabled={page >= data.pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="p-2 rounded-md border border-border disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            <Modal
                isOpen={modalMode === "create"}
                onClose={closeModal}
                title="Add client"
            >
                <ClientForm
                    onSubmit={handleCreate}
                    isSubmitting={createClient.isPending}
                    submitLabel="Add client"
                />
            </Modal>

            <Modal
                isOpen={modalMode === "edit"}
                onClose={closeModal}
                title="Edit client"
            >
                <ClientForm
                    initialValues={editingClient}
                    onSubmit={handleUpdate}
                    isSubmitting={updateClient.isPending}
                    submitLabel="Save changes"
                />
            </Modal>
        </div>
    );
};