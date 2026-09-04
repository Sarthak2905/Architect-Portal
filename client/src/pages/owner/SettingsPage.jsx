import { useState } from "react";
import { KeyRound, MessageCircle } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useUpdateCredentials } from "../../api/hooks/useAuth";
import { axiosClient } from "../../api/axiosClient";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../api/hooks/useAuth";

const ChangeCredentialsCard = () => {
  const { user } = useAuth();
  const [values, setValues] = useState({
    currentPassword: "",
    newUsername: "",
    newPassword: "",
  });
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const updateCredentials = useUpdateCredentials();

  const handleChange = (field) => (e) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!values.currentPassword.trim()) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }
    if (!values.newUsername.trim() && !values.newPassword.trim()) {
      setMessage({ type: "error", text: "Enter a new username and/or new password" });
      return;
    }
    if (values.newPassword && values.newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }

    try {
      const payload = { currentPassword: values.currentPassword };
      if (values.newUsername.trim()) payload.newUsername = values.newUsername.trim();
      if (values.newPassword.trim()) payload.newPassword = values.newPassword.trim();

      await updateCredentials.mutateAsync(payload);
      setMessage({ type: "success", text: "Credentials updated successfully." });
      setValues({ currentPassword: "", newUsername: "", newPassword: "" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update credentials",
      });
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-md bg-slate-100 text-muted">
          <KeyRound size={18} />
        </div>
        <div>
          <p className="font-medium">Login credentials</p>
          <p className="text-sm text-muted">Signed in as {user?.username}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Current password"
          type="password"
          value={values.currentPassword}
          onChange={handleChange("currentPassword")}
          placeholder="Required to make any change"
        />
        <Input
          label="New username (optional)"
          value={values.newUsername}
          onChange={handleChange("newUsername")}
          placeholder="Leave blank to keep current"
        />
        <Input
          label="New password (optional)"
          type="password"
          value={values.newPassword}
          onChange={handleChange("newPassword")}
          placeholder="Leave blank to keep current"
        />

        {message && (
          <p className={`text-sm ${message.type === "error" ? "text-error" : "text-success"}`}>
            {message.text}
          </p>
        )}

        <Button type="submit" disabled={updateCredentials.isPending} className="w-fit">
          {updateCredentials.isPending ? "Saving..." : "Update credentials"}
        </Button>
      </form>
    </Card>
  );
};

const WhatsAppStatusCard = () => {
  const [testPhone, setTestPhone] = useState("");
  const [status, setStatus] = useState(null); // { type, text }
  const [isSending, setIsSending] = useState(false);

  const handleTest = async () => {
    if (!testPhone.trim()) {
      setStatus({ type: "error", text: "Enter a verified test phone number" });
      return;
    }
    setIsSending(true);
    setStatus(null);
    try {
      await axiosClient.post("/notifications/test-whatsapp", { phone: testPhone.trim() });
      setStatus({ type: "success", text: "Test message sent — check that phone's WhatsApp." });
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Failed to send — check your WhatsApp credentials in .env",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-md bg-slate-100 text-muted">
          <MessageCircle size={18} />
        </div>
        <div>
          <p className="font-medium">WhatsApp connection</p>
          <p className="text-sm text-muted">Send a test message to confirm your credentials work</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={testPhone}
          onChange={(e) => setTestPhone(e.target.value)}
          placeholder="Verified test number, e.g. 9876543210"
          className="flex-1"
        />
        <Button onClick={handleTest} disabled={isSending} variant="secondary" className="shrink-0">
          {isSending ? "Sending..." : "Send test message"}
        </Button>
      </div>

      {status && (
        <p className={`text-sm ${status.type === "error" ? "text-error" : "text-success"}`}>
          {status.text}
        </p>
      )}
    </Card>
  );
};

const LogoutCard = () => {
    const { logout } = useAuth();
    const logoutMutation = useLogout();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } finally {
            // Clear local session regardless of whether the server call
            // succeeded — no point leaving the user stuck logged in on the
            // frontend if the network request happens to fail.
            logout();
            navigate("/login");
        }
    };

    return (
        <Card className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-red-50 text-error">
                    <LogOut size={18} />
                </div>
                <div>
                    <p className="font-medium">Log out</p>
                    <p className="text-sm text-muted">End your current session on this device</p>
                </div>
            </div>
            <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
            >
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </Button>
        </Card>
    );
};

export const SettingsPage = () => {
    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-6">
            <header>
                <h1 className="text-2xl md:text-3xl">Settings</h1>
                <p className="text-muted mt-1">Manage your login and integration settings</p>
            </header>

            <ChangeCredentialsCard />
            <WhatsAppStatusCard />
            <LogoutCard />
        </div>
    );
};