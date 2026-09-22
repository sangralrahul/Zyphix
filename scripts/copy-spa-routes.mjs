import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("artifacts/zyphix/dist/public");
const appEntry = path.join(outputDirectory, "index.html");
const routes = [
  "light",
  "privacy",
  "terms",
  "about",
  "contact",
  "blog",
  "investors",
  "merchant-setup",
  "delivery-setup",
  "restaurant-setup",
  "now",
  "wallet",
  "wishlist",
  "notifications",
  "admin",
  "partner-dashboard",
  "eats",
  "book",
  "offers",
  "kirana-map",
  "partner",
  "app",
  "account",
];

await Promise.all(
  routes.map(async (route) => {
    const routeDirectory = path.join(outputDirectory, route);
    await mkdir(routeDirectory, { recursive: true });
    await copyFile(appEntry, path.join(routeDirectory, "index.html"));
  }),
);

console.log(`Created direct-link entry pages for ${routes.length} app routes.`);