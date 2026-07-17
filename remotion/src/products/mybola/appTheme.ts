// MyBola app design tokens — from flutter/lib/core/app_theme.dart.
// Product layer only: these are the colours INSIDE the phone. Brand/narration
// tokens (cream, ink, coral) live in brand.ts and never appear here.
//
// MyBola is the first product built on the shared chat primitives, so the shared
// default token set IS MyBola's. Re-exported here so scene code reads
// product-local tokens; a product with different app colours defines its own
// values instead of re-exporting.
export { ui, uiText, SC, UIFONT, usePjs } from "../../shared/ui/theme";
export type { UiTheme as AppTheme } from "../../shared/ui/theme";
