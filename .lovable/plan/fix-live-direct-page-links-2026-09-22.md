# Fix live direct-page links

## Changes
- Generate deployable HTML entry files for every existing app page, including `/privacy`, `/terms`, and `/partner`.
- Keep the current app, navigation, styling, and functionality unchanged.
- Build and verify direct URLs locally, then publish the corrected site and confirm `https://zyphix.in/privacy` loads.

## Technical details
- The current host ignores the `_redirects` fallback and returns 404 before the browser app starts.
- A post-build step will copy the generated app entry point into each route directory so direct requests resolve normally.
