import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    // Defensive guard — this component should never wrap a portal route,
    // but if it ever does by mistake, don't force a login redirect there.
    if (window.location.pathname.startsWith("/portal")) {
        return children;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};