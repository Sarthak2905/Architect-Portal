import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ProjectForm } from "../../components/owner/ProjectForm";
import { ProjectCard } from "../../components/owner/ProjectCard";
import { StatusStepper } from "../../components/owner/StatusStepper";
import { PROJECT_STATUSES } from "../../utils/projectStatuses";
import {
    useProjects,
    useCreateProject,
    useUpdateProject,
    useUpdateProjectStatus,
    useArchiveProject,
    useRestoreProject,
} from "../../api/hooks/useProjects";

export const ProjectsPage = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [archivedFilter, setArchivedFilter] = useState("false");
    const [modalMode, setModalMode] = useState(null); // null | "create" | "edit" | "status"
    const [activeProject, setActiveProject] = useState(null);

    const { data, isLoading } = useProjects({
        search,
        status: statusFilter || undefined,
        page,
        archived: archivedFilter,
    });

    const createProject = useCreateProject();
    const updateProject = useUpdateProject();
    const updateStatus = useUpdateProjectStatus();
    const archiveProject = useArchiveProject();
    const restoreProject = useRestoreProject();

    const closeModal = () => {
        setModalMode(null);
        setActiveProject(null);
    };

    const handleCreate = async (values) => {
        await createProject.mutateAsync(values);
        closeModal();
    };

    const handleUpdate = async (values) => {
        await updateProject.mutateAsync({ id: activeProject._id, payload: values });
        closeModal();
    };

    const handleStatusSelect = async (status) => {
        await updateStatus.mutateAsync({ id: activeProject._id, status });
        closeModal();
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col gap-5">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl">Projects</h1>
                    <p className="text-muted mt-1">{data?.pagination?.total ?? 0} total</p>
                </div>
                <Button onClick={() => setModalMode("create")}>
                    <Plus size={16} /> New project
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
                        placeholder="Search projects..."
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
                    <option value="">All statuses</option>
                    {PROJECT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <select
                    value={archivedFilter}
                    onChange={(e) => {
                        setArchivedFilter(e.target.value);
                        setPage(1);
                    }}
                    className="rounded-md border border-border bg-white px-3 py-2.5 text-sm"
                >
                    <option value="false">Active</option>
                    <option value="true">Archived</option>
                    <option value="all">All</option>
                </select>
            </div>

            {isLoading ? (
                <p className="text-sm text-muted text-center py-8">Loading projects...</p>
            ) : !data?.projects?.length ? (
                <p className="text-sm text-muted text-center py-8">No projects found.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.projects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onEdit={(p) => {
                                setActiveProject(p);
                                setModalMode("edit");
                            }}
                            onUpdateStatus={(p) => {
                                setActiveProject(p);
                                setModalMode("status");
                            }}
                            onArchive={(id) => archiveProject.mutate(id)}
                            onRestore={(id) => restoreProject.mutate(id)}
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

            <Modal isOpen={modalMode === "create"} onClose={closeModal} title="New project">
                <ProjectForm
                    onSubmit={handleCreate}
                    isSubmitting={createProject.isPending}
                    submitLabel="Create project"
                />
            </Modal>

            <Modal isOpen={modalMode === "edit"} onClose={closeModal} title="Edit project">
                <ProjectForm
                    initialValues={activeProject}
                    onSubmit={handleUpdate}
                    isSubmitting={updateProject.isPending}
                    submitLabel="Save changes"
                    isEdit
                />
            </Modal>

            <Modal isOpen={modalMode === "status"} onClose={closeModal} title="Update project status">
                {activeProject && (
                    <StatusStepper
                        currentStatus={activeProject.status}
                        onSelectStatus={handleStatusSelect}
                        isUpdating={updateStatus.isPending}
                    />
                )}
            </Modal>
        </div>
    );
};