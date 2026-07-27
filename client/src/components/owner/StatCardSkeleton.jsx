import { Card } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

export const StatCardSkeleton = () => (
    <Card className="flex items-start justify-between">
        <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="h-9 w-9 rounded-md shrink-0" />
    </Card>
);