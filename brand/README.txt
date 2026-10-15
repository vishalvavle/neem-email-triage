NeemTechAI — Logo asset pack
============================

TYPEFACE
  Manrope ExtraBold (800). Open source, SIL Open Font License.
  Google Fonts: https://fonts.google.com/specimen/Manrope
  Manrope-ExtraBold.ttf is included for use in design tools.
  The wordmark in every SVG here is OUTLINED — no font needed to render them.

COLOURS
  Brand green      #0D5C35   leaf + "Neem" + "AI" on light backgrounds
  Ink              #111111   "Tech" on light backgrounds
  Green on dark    #4EA87A   substitute for the brand green on dark backgrounds
                             (#0D5C35 fails contrast on near-black)

FILES
  neemtechai-horizontal.svg           primary lockup, use this by default
  neemtechai-horizontal-reversed.svg  for dark backgrounds
  neemtechai-horizontal-green.svg     single colour
  neemtechai-horizontal-black.svg     single colour
  neemtechai-horizontal-white.svg     single colour, knockout
  neemtechai-stacked.svg              square-ish spaces
  neemtechai-stacked-reversed.svg     square-ish spaces, dark

  mark-detail.svg      full circuit-vein leaf. Use at 80px and above.
  mark-simple.svg      reduced veins. Use 32-80px.
  favicon-mark.svg     silhouette + midrib only. Use 32px and below.
  app-icon.svg         green rounded square, white leaf. Touch icons.

  png/  raster exports at common sizes.

MINIMUM SIZES  (this is the important bit)
  The detailed leaf loses its circuit veins below roughly 80px and turns to
  mush by 32px. That is why three detail levels exist. Pick by render size:
     >= 80px   mark-detail
     32-80px   mark-simple
     <= 32px   favicon-mark
  The horizontal lockup stays legible down to about 20px tall. Below that,
  use the mark alone.

CLEAR SPACE
  Keep free space around the lockup equal to the height of the leaf's stem,
  roughly 12% of the lockup height, on all sides.

FAVICON HTML
  <link rel="icon" href="/favicon-mark.svg" type="image/svg+xml">
  <link rel="icon" href="/png/favicon-32.png" sizes="32x32">
  <link rel="apple-touch-icon" href="/png/app-icon-180.png">

CSS
  :root{
    --brand-green:#0D5C35;
    --brand-green-on-dark:#4EA87A;
    --ink:#111111;
  }
  font-family:'Manrope',sans-serif; font-weight:800; letter-spacing:-0.035em;
