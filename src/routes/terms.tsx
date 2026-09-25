import { lazy, Suspense } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";

const Terms = lazy(() => import("@/pages/Terms").then((module) => ({ default: module.Terms })));

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | ZYPHIX" },
      { name: "description", content: "Read the terms governing use of ZYPHIX services and applications." },
      { property: "og:title", content: "Terms of Service | ZYPHIX" },
      { property: "og:description", content: "Read the terms governing use of ZYPHIX services and applications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsRoute,
});

function TermsRoute() {
  return (
    <ClientOnly fallback={null}>
      <Suspense fallback={null}>
        <Terms />
      </Suspense>
    </ClientOnly>
  );
}