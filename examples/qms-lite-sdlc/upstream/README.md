# Optional Upstream Checkout

This directory is reserved for an optional read-only `qms-lite` submodule.

Recommended use:

```bash
git submodule add https://github.com/AliakseiT/qms-lite.git upstream/qms-lite
git -C upstream/qms-lite checkout 4bd638d2ccaca6dbfb2a20492225abce55017882
```

Use it for:

- reviewer context
- agent context
- file-to-file comparison against the adopted upstream baseline

Do not use it for:

- SDLC-owned record authoring
- direct edits to upstream-controlled content
- storing local execution evidence
