import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/owner/LoginPage";
import { DashboardPage } from "../pages/owner/DashboardPage";
import { ClientsPage } from "../pages/owner/ClientsPage";
import { ProjectsPage } from "../pages/owner/ProjectsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { OwnerLayout } from "../layouts/OwnerLayout";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

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
                {/* Phase F6 will add: <Route path="/projects/:id" element={<ProjectDetailPage />} /> */}
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};