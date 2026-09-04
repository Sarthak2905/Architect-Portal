import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/owner/LoginPage";
import { DashboardPage } from "../pages/owner/DashboardPage";
import { ClientsPage } from "../pages/owner/ClientsPage";
import { ProjectsPage } from "../pages/owner/ProjectsPage";
import { ProjectDetailPage } from "../pages/owner/ProjectDetailPage";
import { SettingsPage } from "../pages/owner/SettingsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { OwnerLayout } from "../layouts/OwnerLayout";
import { PortalLayout } from "../layouts/PortalLayout";
import { PortalOverviewPage } from "../pages/portal/PortalOverviewPage";
import { PortalTimelinePage } from "../pages/portal/PortalTimelinePage";
import { PortalDocumentsPage } from "../pages/portal/PortalDocumentsPage";
import { PortalPhotosPage } from "../pages/portal/PortalPhotosPage";
import { PortalPaymentsPage } from "../pages/portal/PortalPaymentsPage";


export const AppRoutes = () => {
    return (
        <Routes>
            {/* Owner login — public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Owner app — everything inside here requires login */}
            <Route
                element={
                    <ProtectedRoute>
                        <OwnerLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Client portal — PUBLIC, sibling of the block above, NOT nested
          inside it. The token in the URL is the only credential. */}
            <Route path="/portal/:token" element={<PortalLayout />}>
                <Route index element={<PortalOverviewPage />} />
                <Route path="timeline" element={<PortalTimelinePage />} />
                <Route path="documents" element={<PortalDocumentsPage />} />
                <Route path="photos" element={<PortalPhotosPage />} />
                <Route path="payments" element={<PortalPaymentsPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
    );
};