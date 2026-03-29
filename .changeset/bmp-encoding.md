---
'@embedpdf/models': minor
'@embedpdf/engines': minor
'@embedpdf/plugin-render': minor
---

Add BMP encoding support and make it the default image format

BMP encoding bypasses canvas.toBlob() entirely by prepending a 66-byte header to the raw RGBA pixel data. This eliminates the dominant rendering bottleneck — in benchmarks, encoding dropped from ~76ms average (PNG via canvas.toBlob) to <1ms, reducing total tile render time by ~60%.

The BMP uses BI_BITFIELDS with channel masks matching PDFium's RGBA output byte order, so no per-pixel conversion is needed. Top-down row order avoids row flipping. The result is a valid BMP that all modern browsers decode natively in `<img>` elements.

Users who need compressed output (e.g. for export or network transfer) can set `defaultImageType: 'image/png'` in the render plugin config to restore the previous behavior.
