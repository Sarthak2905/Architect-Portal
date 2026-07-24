import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { useLogin } from "../../api/hooks/useAuth";
import { useAuth } from "../../context/AuthContext";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const loginMutation = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Username and password are required");
            return;
        }

        try {
            const { accessToken, user } = await loginMutation.mutateAsync({ username, password });
            login(accessToken, user);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-4">
            <Card elevated className="w-full max-w-sm p-6">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl">Architect Portal</h1>
                    <p className="text-muted text-sm mt-1">Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />

                    {error && <p className="text-sm text-error">{error}</p>}

                    <Button type="submit" className="w-full mt-2" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </Card>
        </div>
    );
};