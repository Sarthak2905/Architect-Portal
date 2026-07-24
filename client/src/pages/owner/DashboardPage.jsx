import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { useLogout } from "../../api/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const logoutMutation = useLogout();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl">Dashboard</h1>
                <Button variant="secondary" onClick={handleLogout}>
                    Log out
                </Button>
            </div>
            <p className="text-muted">
                Signed in as <span className="font-medium text-ink">{user?.username}</span>. Real dashboard content comes in Phase F3.
            </p>
        </div>
    );
};