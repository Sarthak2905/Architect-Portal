import { AlertCircle } from "lucide-react";

export const PortalNotFoundPage = () => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
            <AlertCircle className="mx-auto text-muted mb-3" size={40} />
            <h1 className="text-xl font-semibold">Link not found</h1>
            <p className="text-muted mt-1 max-w-sm">
                This portal link is invalid or no longer active. Please contact your architect for an updated link.
            </p>
        </div>
    </div>
);