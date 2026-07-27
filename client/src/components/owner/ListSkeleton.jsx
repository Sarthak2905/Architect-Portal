import { Card } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

// Generic card-list placeholder — used for clients, projects, updates,
// documents, and payments lists so every list has a consistent loading
// feel instead of each page inventing its own "Loading..." text.
export const ListSkeleton = ({ rows = 3 }) => (
    <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
            <Card key={i} className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md shrink-0" />
            </Card>
        ))}
    </div>
);