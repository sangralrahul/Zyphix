# Fix the live Zyphix deployment

## Goal
Restore the published Zyphix website and all direct page links without changing its design or content.

## Work
- Replace the incomplete custom production build setup with Lovable's supported TanStack Start deployment configuration.
- Ensure React and other server dependencies are bundled into the published application instead of being left unavailable at runtime.
- Preserve the existing client-only boundary around the legacy Zyphix application.
- Verify the homepage, Privacy, Terms, Partner, and shopping pages in the preview.
- Check the current security scan, publish the corrected version, and confirm the live domain responds.

## Technical details
The current deployment starts but fails before rendering because its server bundle imports `react` as an external runtime module. The fix will use the platform's Vite/TanStack build configuration, which produces a self-contained edge deployment.
