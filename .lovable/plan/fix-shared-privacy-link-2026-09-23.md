# Fix shared `/privacy` link

## Goal
Make `https://zyphix.in/privacy` load the existing Privacy Policy when opened directly or shared, while preserving the current page and footer behavior.

## Changes
- Register `/privacy` as a real build entry so Lovable Hosting includes it in the deployed files, rather than relying on a post-build copy that publishing omits.
- Keep the existing Privacy Policy React page and styling unchanged.
- Verify the generated deployment output contains `privacy/index.html`, then test direct navigation in the preview.
- Publish the corrected build and confirm the expected public URL.

## Technical details
- Add a Vite multi-page HTML entry for `/privacy` and include it in the build input graph.
- Remove `/privacy` from the post-build route-copy workaround to avoid conflicting output.
