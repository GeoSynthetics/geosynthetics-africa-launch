import { Await } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Only supplementary sections suspend; headings, forms and page state stay mounted. */
export function DeferredRelated({
  data,
  children,
  fallback,
}: {
  data: { related?: Promise<any>; [key: string]: any };
  children: (resolved: any) => ReactNode;
  fallback?: ReactNode;
}) {
  if (!data.related) return children(data);
  return (
    <Await promise={data.related} fallback={fallback ?? <></>}>
      {children}
    </Await>
  );
}
