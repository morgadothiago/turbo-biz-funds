import { Skeleton } from "@/components/ui/skeleton";

export function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-6 animate-pulse" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-8 space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Button */}
          <Skeleton className="h-11 w-full rounded-lg" />

          {/* Divider */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Google Button */}
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Footer */}
        <div className="text-center">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function CadastroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-6 animate-pulse" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary animate-pulse" />
          <div className="w-16 h-0.5 rounded-full bg-muted" />
          <div className="w-8 h-8 rounded-full bg-muted" />
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-6 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Button */}
          <Skeleton className="h-11 w-full rounded-lg mt-6" />

          {/* Divider */}
          <div className="flex items-center gap-4 mt-6">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Google Button */}
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-3 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}
