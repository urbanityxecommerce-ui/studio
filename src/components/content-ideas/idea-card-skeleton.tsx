import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IdeaCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-16" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}
