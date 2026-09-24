import { createFileRoute } from "@tanstack/react-router";
import { Terms } from "@/pages/Terms";

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
  component: Terms,
});