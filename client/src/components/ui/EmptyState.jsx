import { Card } from "./Card";

/**
 * Consistent empty-state pattern for every list in the app — an icon,
 * a message, and an optional action. Replaces the plain "No X found"
 * text that was scattered ad-hoc across pages.
 */
export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <Card className="flex flex-col items-center text-center py-10 px-6">
        {Icon && (
            <div className="p-3 rounded-full bg-slate-100 text-muted mb-3">
                <Icon size={22} />
            </div>
        )}
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-sm text-muted mt-1 max-w-xs">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
    </Card>
);