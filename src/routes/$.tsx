import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import App from "@/App";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "ZYPHIX | Local Delivery and Services" },
      { name: "description", content: "Explore ZYPHIX local delivery, food, shopping, and services." },
      { property: "og:title", content: "ZYPHIX | Local Delivery and Services" },
      { property: "og:description", content: "Explore ZYPHIX local delivery, food, shopping, and services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LegacyRoute,
});

function LegacyRoute() {
  return <ClientOnly fallback={<div style={{ minHeight: "100vh", background: "#0A0E1A" }} />}><App /></ClientOnly>;
}