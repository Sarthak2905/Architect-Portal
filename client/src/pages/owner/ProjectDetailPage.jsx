import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, BellRing } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Tabs } from "../../components/owner/Tabs";
import { TimelineList } from "../../components/owner/TimelineList";
import { AddUpdateForm } from "../../components/owner/AddUpdateForm";
import { DocumentUploadForm } from "../../components/owner/DocumentUploadForm";
import { DocumentList } from "../../components/owner/DocumentList";
import { PhotoGallery } from "../../components/owner/PhotoGallery";
import { PaymentSummaryCard } from "../../components/owner/PaymentSummaryCard";
import { AddPaymentForm } from "../../components/owner/AddPaymentForm";
import { PaymentLedger } from "../../components/owner/PaymentLedger";
import { STATUS_BADGE_TONE } from "../../utils/projectStatuses";
import { useProject } from "../../api/hooks/useProjects";
import { useProjectUpdates, useCreateUpdate } from "../../api/hooks/useUpdates";
import {
    useProjectDocuments,
    useUploadDocument,
    useDeleteDocument,
} from "../../api/hooks/useDocuments";
import {
    useProjectPayments,
    useCreatePayment,
    useDeletePayment,
    useSendPaymentReminder,
} from "../../api/hooks/usePayments";

const TABS = [
    { value: "timeline", label: "Timeline" },
    { value: "documents", label: "Documents" },
    { value: "photos", label: "Photos" },
    { value: "payments", label: "Payments" },
];

export const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("timeline");
    const [modalMode, setModalMode] = useState(null); // null | "update" | "upload" | "payment"
    const [reminderStatus, setReminderStatus] = useState("");

    const { data: project, isLoading: projectLoading } = useProject(id);
    const { data: updatesData, isLoading: updatesLoading } = useProjectUpdates(id);
    const { data: documents, isLoading: documentsLoading } = useProjectDocuments(
        id,
        activeTab === "photos" ? "Photo" : undefined
    );
    const { data: paymentsData, isLoading: paymentsLoading } = useProjectPayments(id);

    const createUpdate = useCreateUpdate(id);
    const uploadDocument = useUploadDocument(id);
    const deleteDocument = useDeleteDocument(id);
    const createPayment = useCreatePayment(id);
    const deletePayment = useDeletePayment(id);
    const sendReminder = useSendPaymentReminder(id);

    const nonPhotoDocuments = documents?.filter((d) => d.type !== "Photo");
    const photoDocuments = documents;

    const handlePostUpdate = async (values) => {
        await createUpdate.mutateAsync(values);
        setModalMode(null);
    };

    const handleUpload = async (formData) => {
        await uploadDocument.mutateAsync(formData);
        setModalMode(null);
    };

    const handleAddPayment = async (values) => {
        await createPayment.mutateAsync(values);
        setModalMode(null);
    };

    const handleSendReminder = async () => {
        setReminderStatus("sending");
        try {
            await sendReminder.mutateAsync();
            setReminderStatus("sent");
        } catch (err) {
            setReminderStatus(err.response?.data?.message || "Failed to send reminder");
        }
        setTimeout(() => setReminderStatus(""), 3000);
    };

    if (projectLoading) {
        return <div className="p-6 text-sm text-muted">Loading project...</div>;
    }

    if (!project) {
        return <div className="p-6 text-sm text-muted">Project not found.</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col gap-5">
            <button
                onClick={() => navigate("/projects")}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-ink w-fit"
            >
                <ArrowLeft size={16} /> Back to projects
            </button>

            <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl md:text-3xl truncate">{project.title}</h1>
                        <Badge tone={STATUS_BADGE_TONE[project.status] || "neutral"}>{project.status}</Badge>
                    </div>
                    <p className="text-muted mt-1">{project.client?.name}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button variant="secondary" onClick={() => setModalMode("upload")}>
                        <Plus size={16} /> Upload
                    </Button>
                    <Button onClick={() => setModalMode("update")}>
                        <Plus size={16} /> Update
                    </Button>
                </div>
            </header>

            <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

            {activeTab === "timeline" && (
                <TimelineList updates={updatesData?.updates} isLoading={updatesLoading} />
            )}

            {activeTab === "documents" && (
                <DocumentList
                    documents={nonPhotoDocuments}
                    isLoading={documentsLoading}
                    onDelete={(docId) => deleteDocument.mutate(docId)}
                />
            )}

            {activeTab === "photos" && (
                <PhotoGallery
                    photos={photoDocuments}
                    isLoading={documentsLoading}
                    onDelete={(docId) => deleteDocument.mutate(docId)}
                />
            )}

            {activeTab === "payments" && (
                <div className="flex flex-col gap-4">
                    <PaymentSummaryCard summary={paymentsData?.summary} />

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <Button size="sm" onClick={() => setModalMode("payment")}>
                            <Plus size={15} /> Add entry
                        </Button>
                        <div className="flex items-center gap-2">
                            {reminderStatus && (
                                <span className="text-xs text-muted">
                                    {reminderStatus === "sending"
                                        ? "Sending..."
                                        : reminderStatus === "sent"
                                            ? "Reminder sent ✓"
                                            : reminderStatus}
                                </span>
                            )}
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleSendReminder}
                                disabled={reminderStatus === "sending"}
                            >
                                <BellRing size={15} /> Send reminder
                            </Button>
                        </div>
                    </div>

                    <PaymentLedger
                        payments={paymentsData?.payments}
                        isLoading={paymentsLoading}
                        onDelete={(paymentId) => deletePayment.mutate(paymentId)}
                    />
                </div>
            )}

            <Modal isOpen={modalMode === "update"} onClose={() => setModalMode(null)} title="Post an update">
                <AddUpdateForm onSubmit={handlePostUpdate} isSubmitting={createUpdate.isPending} />
            </Modal>

            <Modal isOpen={modalMode === "upload"} onClose={() => setModalMode(null)} title="Upload a document">
                <DocumentUploadForm
                    onSubmit={handleUpload}
                    isSubmitting={uploadDocument.isPending}
                    defaultType={activeTab === "photos" ? "Photo" : undefined}
                />
            </Modal>

            <Modal isOpen={modalMode === "payment"} onClose={() => setModalMode(null)} title="Add payment entry">
                <AddPaymentForm onSubmit={handleAddPayment} isSubmitting={createPayment.isPending} />
            </Modal>
        </div>
    );
};