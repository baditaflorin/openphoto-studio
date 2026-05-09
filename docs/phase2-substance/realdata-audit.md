# Phase 2 Substance Real-Data Audit

Date: 2026-05-09

Mode: A, pure GitHub Pages.

Build audited: v0.1.0, commit `7a82360`.

Primary v1 flow tested: open image, wait for preview, run Auto tone, export default PNG.

Temporary audit files were downloaded to `tmp/phase2-audit/inputs/`. They are not committed as fixtures yet; fixture commits come after confirmation.

## Summary

Strict pass means: the app completed open -> preview -> auto tone -> export with no crash, no silent data loss, and no wrong-confident claim.

Current strict pass rate: 4/10.

Lenient technical completion rate: 6/10 loaded and exported.

The difference matters: the huge panorama and animated GIF technically exported, but v1 silently changed what the user probably thought they were editing.

## Inputs

| #   | Input                                         | Source                                                                       | Real-world shape                             |
| --- | --------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------- |
| 1   | `01-clean-webp.webp`                          | https://www.gstatic.com/webp/gallery/1.webp                                  | Clean web image                              |
| 2   | `02-exif-orientation-6.jpg`                   | https://github.com/recurser/exif-orientation-examples                        | Phone-style JPEG with EXIF orientation       |
| 3   | `03-huge-panorama.jpg`                        | https://commons.wikimedia.org/wiki/File:Fronalpstock_big.jpg                 | 14 MB, 10109 x 4542 DSLR panorama            |
| 4   | `04-alpha-logo.png`                           | https://commons.wikimedia.org/wiki/File:PNG_transparency_demonstration_1.png | PNG with alpha                               |
| 5   | `05-animated-earth.gif`                       | https://commons.wikimedia.org/wiki/File:Rotating_earth_(large).gif           | Animated GIF                                 |
| 6   | `06-iphone-heic.heic`                         | https://github.com/nokiatech/heif/tree/gh-pages/content/images               | HEIC/HEIF phone-style image                  |
| 7   | `07-scanner-tiff.tif`                         | https://samples.ffmpeg.org/image-samples/tiff/G31D.TIF                       | Scanner/fax-style TIFF                       |
| 8   | `08-unicode filename – café NBSP rtl-אבג.jpg` | Derived from #2, filename altered                                            | Valid image with Unicode, NBSP, RTL filename |
| 9   | `09-truncated-panorama.jpg`                   | Derived from #3, first 16 KB only                                            | Partial/corrupted upload                     |
| 10  | `10-empty-upload.jpg`                         | Empty local file                                                             | Empty/broken user input                      |

## Per-Input Audit

### 1. Clean WebP

What v1 did: loaded at 550 x 368, auto tone completed, exported `01-clean-webp.png`.

What it should have done: this path is mostly fine, but the app should infer that the source was WebP and suggest WebP or preserve-source export when appropriate.

Failure mode: pass, with mild format-default friction.

Manual work the user had to do: know that PNG export may be larger than the original WebP.

### 2. EXIF-Rotated JPEG

What v1 did: loaded at 1800 x 1200, auto tone completed, exported PNG.

What it should have done: show that EXIF orientation was applied and warn that EXIF/camera metadata will not be preserved in export.

Failure mode: pass, but metadata/orientation handling is implicit.

Manual work the user had to do: trust that orientation was handled and know metadata is being dropped.

### 3. Huge Panorama

What v1 did: decoded a 14 MB, 10109 x 4542 JPEG into a 2600 x 1168 canvas, auto tone completed in about 1.1 s, exported PNG.

What it should have done: explicitly say the image was downscaled for browser safety, show original and working dimensions, expose an export-resolution choice, and make the >300 ms work visibly progressive.

Failure mode: wrong-but-confident. The app says the preview rendered locally, but does not tell the user this is no longer the full-resolution image.

Manual work the user had to do: infer that the export is smaller and unsuitable for full-resolution delivery.

### 4. PNG With Alpha

What v1 did: loaded at 800 x 600, auto tone completed, exported PNG.

What it should have done: detect transparency and recommend PNG/WebP, and warn if the user chooses JPEG because alpha would be flattened.

Failure mode: pass on default PNG, but lacks alpha-aware export intelligence.

Manual work the user had to do: know which export formats preserve transparency.

### 5. Animated GIF

What v1 did: loaded a 400 x 400 preview, auto tone completed, exported a still PNG.

What it should have done: detect animation, tell the user that only the first frame is editable in v1, and mark export as a still image.

Failure mode: wrong-but-confident. The app silently flattened an animation to one frame.

Manual work the user had to do: know that a browser canvas edit discards animation.

### 6. HEIC/HEIF Image

What v1 did: failed with `The source image could not be decoded.`

What it should have done: identify HEIC/HEIF by extension and magic bytes, explain that this browser build cannot decode it yet, and suggest converting to JPEG/PNG/WebP before import.

Failure mode: obvious but generic.

Manual work the user had to do: diagnose the format and decide the next step.

### 7. Scanner/Fax TIFF

What v1 did: failed with `The source image could not be decoded.`

What it should have done: identify TIFF, explain browser decode support is not available in v1, and suggest conversion or a future TIFF/WASM path.

Failure mode: obvious but generic.

Manual work the user had to do: diagnose that the file type, not the user's image, is the issue.

### 8. Unicode/NBSP/RTL Filename JPEG

What v1 did: loaded at 1800 x 1200, auto tone completed, exported with the Unicode filename preserved.

What it should have done: this is mostly correct. It should still provide a safe ASCII fallback for filesystems that reject parts of the name.

Failure mode: pass.

Manual work the user had to do: none in the tested browser.

### 9. Truncated JPEG

What v1 did: failed with `The source image could not be decoded.`

What it should have done: identify that the JPEG appears incomplete/corrupt and suggest re-downloading or exporting again from the source app.

Failure mode: obvious but generic.

Manual work the user had to do: distinguish corruption from unsupported format.

### 10. Empty Upload

What v1 did: failed with `The source image could not be decoded.`

What it should have done: immediately say the file is empty, before trying image decode.

Failure mode: obvious but generic.

Manual work the user had to do: inspect the file manually.

## Top 5 Logic Gaps

1. No preflight input diagnosis. HEIC, TIFF, truncated JPEG, and empty file all collapse into the same generic decode message.
2. Silent data loss is possible. Huge images are downscaled, animated GIFs become still images, and metadata is dropped without warning.
3. Export defaults are not image-aware. The app does not infer best export format from source format, transparency, animation, or user intent.
4. Processing lacks performance honesty. Work over 300 ms uses the same generic state, and >1 s operations are not cancellable.
5. Outputs lack provenance. Exports do not carry source hash, original dimensions, working dimensions, app version, commit, settings, or confidence.

## Top 3 Intuition Failures

1. `Preview rendered locally` sounds final and truthful even when the app has downscaled the image.
2. Animated GIF import looks successful, but export silently discards animation.
3. Unsupported, corrupt, and empty files all produce the same message, so the user cannot tell what to do next.

## Top 3 Feels-Stupid Moments

1. The user has to know which formats the browser can decode; the app should identify unsupported formats before attempting decode.
2. The user has to know when PNG, JPEG, or WebP is the right export choice; the app should recommend based on image facts.
3. The user has to infer hidden transformations like downscaling, EXIF application, metadata loss, and animation flattening.

## What Smart Means for OpenPhoto Studio

Smart means:

1. On first input, the app identifies format, dimensions, megapixels, alpha, animation, likely orientation, file size, and support status before editing.
2. The app makes a safe first guess: recommended export format, working resolution, and whether local processing is likely to be fast or expensive.
3. The app refuses silent wrongness: downscaling, animation flattening, metadata loss, alpha flattening, and unsupported formats are surfaced in domain language.
4. Every failure says what failed, why it likely failed, and what the user can do next.
5. Every output is reproducible enough to inspect: source identity, app version, commit, settings, working dimensions, export format, and confidence travel with the export or sidecar.

## Phase 2 Substance Success Metrics

1. Strict fixture pass rate improves from 4/10 to at least 7/10 without adding new editing tools.
2. 100% of unsupported/broken inputs produce specific actionable messages: HEIC, TIFF, truncated JPEG, and empty file must be distinguishable.
3. 100% of silent-loss cases surface explicit warnings before export: huge-image downscale, animated GIF flattening, alpha-to-JPEG flattening, and metadata loss.
4. Operations over 300 ms show operation-specific progress text; operations that can exceed 5 s have a real cancel path.
5. Re-running the same fixture with the same settings produces deterministic audit metadata 100% of the time.
6. Every export path includes provenance metadata or a sidecar with app version, commit, source hash, original dimensions, working dimensions, settings, export format, and warnings.
7. Median time from file selection to useful preview stays under 1 s on the fixture set, with the huge panorama under 2 s on the audited machine.

## Explicit Out of Scope

- No new editing tools, layers, brushes, crop, rotate, masks, or command palette.
- No visual polish, dark mode, skeleton loaders, marketing pages, or layout redesign.
- No backend, auth, cloud sync, or runtime API.
- No model-backed Real-ESRGAN, RemBG, or Stable Diffusion integration in this substance pass.
- No full HEIC/TIFF decoder implementation unless a later confirmed plan explicitly chooses it; detection and actionable recovery are in scope.
- No Photoshop/PSD parity work.
- No architecture mode change; Phase 2 stays Mode A.
