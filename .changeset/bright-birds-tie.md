---
'@embedpdf/plugin-scroll': patch
---

Fix horizontal scrolling layout calculations and page navigation state updates in `@embedpdf/plugin-scroll`.

This corrects horizontal visible-range and end-spacing math, preserves the optimistic `currentPage` during smooth next/previous navigation, and fixes page-coordinate targeting for mixed-height pages in horizontal mode by matching the scroller's vertical centering.
