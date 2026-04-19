# Workspace Structure

## Allura-Lab Layout
```text
Allura-Lab/
  00-allura-exchange-portal/
  01-asset-templates/
  02-assets/
    asset-one/
    asset-two/
    asset-three/
  03-archive/
  04-docs/
```

## Structure Notes
- `00-allura-exchange-portal` is the command center for the Allura platform.
- `01-asset-templates` holds reusable starter patterns and templates.
- `02-assets` holds each sellable AI asset or business asset in its own separate folder.
- `03-archive` holds retired or completed work.
- `04-docs` holds operating docs, specs, and planning references.

## Operating Rule
- The portal should not contain all asset source code directly.
- Each mature asset should remain in its own workspace location and can later become its own repository or deployment target.
- The portal should track assets through internal records rather than by embedding every asset implementation in the command center.

