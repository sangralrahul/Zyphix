import { lazy, Suspense } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";

const Privacy = lazy(() => import("@/pages/Privacy").then((module) => ({ default: module.Privacy })));

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ZYPHIX" },
      { name: "description", content: "Read the ZYPHIX privacy policy, including how we collect, use, protect, and manage your personal information." },
      { property: "og:title", content: "Privacy Policy | ZYPHIX" },
      { property: "og:description", content: "Read how ZYPHIX collects, uses, protects, and manages your personal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyRoute,
});

function PrivacyRoute() {
  return (
    <ClientOnly fallback={null}>
      <Suspense fallback={null}>
        <Privacy />
      </Suspense>
    </ClientOnly>
  );
}