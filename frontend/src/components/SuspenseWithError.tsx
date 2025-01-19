import { ReactNode, ReactElement, Suspense } from "react";

import ErrorBoundary from "./ErrorBoundary";

export default function SuspenseWithError({
  children,
  errorFallback,
  fallback,
}: {
  children: ReactNode;
  errorFallback: ReactNode;
  fallback?: ReactNode;
}): ReactElement {
  return (
    <ErrorBoundary fallback={errorFallback} onReset={() => {}}>
      <Suspense fallback={fallback || <div>Loading...</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
