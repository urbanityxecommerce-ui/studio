import AppLayout from '@/components/layout/app-layout';

export default function RepurposingPage() {
  return (
    <AppLayout>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            The video repurposing feature is under construction.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
