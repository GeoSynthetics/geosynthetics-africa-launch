import { useRouterState } from "@tanstack/react-router";

/** Shared, readable feedback while the next page's content is loading. */
export function PageLoading() {
  return (
    <section className="min-h-[60vh] bg-background" aria-busy="true">
      <div className="bg-surface-dark text-white py-16 md:py-24">
        <div className="container-page">
          <p className="text-sm uppercase tracking-widest text-white/70">Geosynthetics Africa</p>
          <h1 className="mt-4 text-3xl md:text-4xl font-display font-bold">Opening your page</h1>
          <p role="status" className="mt-4 text-white/90">
            Loading product and project information…
          </p>
          <div aria-hidden="true" className="mt-8 h-1 w-48 overflow-hidden rounded bg-white/20">
            <div className="h-full w-1/2 bg-primary motion-safe:animate-pulse" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="container-page py-12 space-y-4 motion-safe:animate-pulse">
        <div className="h-5 max-w-sm rounded bg-muted" />
        <div className="h-3 max-w-3xl rounded bg-muted" />
        <div className="h-3 max-w-2xl rounded bg-muted" />
      </div>
    </section>
  );
}

/** Immediate confirmation also covers routes with their own loading layouts. */
export function NavigationFeedback() {
  const isLoading = useRouterState({ select: (state) => state.isLoading });
  if (!isLoading) return null;
  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      className="fixed top-0 inset-x-0 z-[100] h-1 overflow-hidden bg-primary/15"
    >
      <div className="h-full w-2/3 bg-primary motion-safe:animate-pulse" />
    </div>
  );
}
