import { TrackingBuilderTab } from "@/components/admin/TrackingBuilderTab";

export function TrackingAdminPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Tracking & Cookies</h2>
          <p className="text-sm text-muted-foreground">
            Manage Google Analytics and Google Tag Manager credentials dynamically compliant with visitor consent.
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <TrackingBuilderTab />
      </div>
    </div>
  );
}
