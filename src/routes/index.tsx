import { lazy, Suspense } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";

const App = lazy(() => import("@/App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZYPHIX - India's SuperLocal App" },
      { name: "description", content: "Groceries, food, home services and more, delivered fast from local partners in Jammu, J&K." },
      { property: "og:title", content: "ZYPHIX - India's SuperLocal App" },
      { property: "og:description", content: "Groceries, food, home services and more, delivered fast from local partners in Jammu, J&K." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  const fallback = <div style={{ minHeight: "100vh", background: "#0A0E1A" }} />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <App />
      </Suspense>
    </ClientOnly>
  );
}