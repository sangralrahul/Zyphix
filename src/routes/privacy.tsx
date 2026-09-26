import { createFileRoute } from "@tanstack/react-router";

import { Router } from "wouter";
import { Privacy } from "@/pages/Privacy";

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
    <Router ssrPath="/privacy">
      <Privacy />
    </Router>
  );
}
