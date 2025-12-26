// app/[slug]/preview/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function PreviewLoading() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="max-w-5xl mx-auto py-10 px-4 flex gap-6 items-center">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        <Skeleton className="w-full h-52 rounded-xl" />
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <section className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </section>

        <section className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </section>

        <section className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
        </section>

        {/* Jobs list skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg bg-white px-4 py-3 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
