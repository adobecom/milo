# Globe-view fidelity backlog

Working doc for the "cards feel low-fidelity / just laid there" effort on the **md desktop
Fibonacci-sphere path**. Not about the sm/touch barrel — that path reads fine today.

Status legend: `todo` · `wip` · `testing` · `shipped` · `rejected`

---

## Baseline facts (measured, don't re-derive)

- **No lights, no fog, no shadows, no tone mapping, no post-processing** anywhere in the block.
  `CARD_FRAG` ends at `pow(texture, 1/2.2)` — cards are pure unlit texture.
- Every card renders at **identical brightness** regardless of facing. `applySphereFacing` early-returns
  on md (`CARD_FACE_CAMERA: 0`), so `cardNormal` isn't even computed there today.
- **3.3× depth ratio across the sphere**: front card at camera distance 30
  (`CAM_Z_SPHERE 65` − `SPHERE_R 35`), back card at 100. Nothing distinguishes them but perspective
  size — no dimming, no blur, no desaturation. `placeSphereCard`'s only depth term is `proxFade`,
  which is near-camera only.
- Cards are **zero-thickness `DoubleSide` planes** → collapse to a line at grazing angles.
- Every card sits at **exactly `r = SPHERE_R`** (`fibSpherePos`) — a perfectly coplanar shell.
- **Not a texture-resolution problem.** A front card is ~190 CSS px tall against `CARD_TEX_MD` 768.
  ~4× headroom. Don't chase this.
- `N_TOTAL` = `CARD_CONTENT.length`, ~24 on md. Any per-card CPU work is ~24 ops/frame = free.

### Why this class of fix is cheap here

Items 1, 2, 4, 5, 6, 7 are all **one CPU-computed scalar per card per frame → one uniform**.
No per-pixel branching, no new render passes, no layout change, no raycast impact. Every one of
them multiplies out to 0 alongside `fdE`, so **grid / arc / peel / fold / modal stay pixel-identical**
and there are no phase-transition pops. That property is worth protecting — if a proposed change
can't be expressed this way, it's a different tier of cost.

---

## Summary

| # | Item | Complexity | Perf | Benefit | Status |
|---|------|-----------|------|---------|--------|
| 1 | Per-card directional shading (N·L) | ~8 lines | negligible | **uncertain** — see per-card-flat risk | todo |
| 2 | ~~Depth fog / atmospheric recession~~ | 19 lines | negligible | — | **rejected** — reads as dimming on a near-black bg |
| 3 | Radius jitter — break the perfect shell | 1 line | slight overdraw ↑ | **high — works on black** | todo |
| 4 | Cheap DOF via texture mip bias | ~4 lines | net **win** | **high — works on black** | todo |
| 5 | Fake edge / thickness (lit rim) | ~10 lines | negligible | medium-high | todo |
| 6 | Inner-shadow AO at card edges | ~3 lines | negligible | medium | todo |
| 7 | Specular sheen sweep | ~12 lines | negligible | medium (gimmick risk) | todo |
| 8 | Curve the cards to the sphere | ~30 lines | trivial | **low on md** | deprioritized |
| 9 | ~~Card size ↑ on md (sparseness lever)~~ | 1 constant | fill ∝ H² | very high | **shipped** (`CARD_H_SPHERE: 8.5`) |
| 10 | Deliberate per-card size variety | ~5 lines + modal mirror | negligible | medium-high | todo |
| 11 | Border / "button-ish" treatment | ~6 lines | negligible | medium | todo |
| 12 | Fibonacci pole sampling (midpoint) | **1 line** | none | high | **shipped** |
| 13 | ~~`CARD_FACE_CAMERA` > 0 on the md sphere~~ | 1 constant | none | — | **rejected** — cards visibly self-spin |

**9 + 12 shipped; 2 + 13 rejected.** Remaining order: **3 → 4 → 5+6+11**, with **1 last and at risk** (see below). 13 and 12 jump the queue because they are
both one-to-five-line fixes to *defects* rather than enhancements, and both land on the north-pole
region that currently reads worst. Expectation after that pass: 5+6+11 still wanted, 4 and 10 optional.

---

## The background is `#131313` — this governs the whole list

`--s2a-color-gray-900` is near-black. That rules out an entire family of depth cues, and it is why
item 2 failed:

**Aerial perspective works because distant objects shift toward a BRIGHT sky and lose contrast
against it.** Mixing toward near-black is arithmetically identical to turning the brightness down, so
it reads as dimming — because it is dimming. No amount of implementation quality changes that.

**Cues that DO work on a black field:** occlusion, parallax, size, blur, and anything that *adds*
light (a rim, a border, a specular). That promotes items **3** (real overlap + parallax), **4** (DOF
blur), and **5/6/11** (edge treatments, which add light against the dark rather than subtracting it).

**The per-card-flat risk.** Cards are large relative to the sphere, so any brightness driven by a
per-object uniform quantizes into hard-edged tiles that step independently as the sphere turns —
measured on item 2: a **0.185 step (34% of the range) across a touching-neighbour seam**. This reads
as cards "lighting on/off one by one." It applies to **any** per-object brightness, so it is a
standing hazard for item 1.

---

## Coupled constants — the md sphere budget

These four are not independent. Changing one moves the others' safe range.

```
SPHERE_R         35     max radial extent
CARD_H_SPHERE    8.5    also sets fadeRefH (mean card height) on the sphere path
NEAR_FADE_START  2.2    fade band start, measured in card-heights
CAM_Z_SPHERE     60     settled camera-to-sphere-centre distance
```

**Hard floor:** front cards dissolve at rest unless

```
CAM_Z_SPHERE  >  SPHERE_R + NEAR_FADE_START × CARD_H_SPHERE
        60    >  35 + 2.2 × 8.5 = 53.7      ✓ 6.3 units of margin
```

Raising `CARD_H_SPHERE` raises that floor (6.5 → 8.5 moved it 49.3 → 53.7). Lowering
`NEAR_FADE_START` lowers it; per the README that dial is "purely visual" — only `NEAR_FADE_END`
anchors `dragFlipZ` and the pull-quote cue — so it is the safe one to spend.

**Not binding in the usable range:** `dragFlipZ`'s `DRAG_FLIP_MAX_CAM_FRAC` cap only starts to bind
below `CAM_Z_SPHERE` 49.4, which is under the floor anyway. The hint-text plane derives its distance
and size from `bp`, so it self-adjusts.

**Two cross-effects of `CAM_Z_SPHERE` worth re-checking after any change:**
1. **iPad.** `CYL_FRUSTUM_H = 2 × TAN_HALF_FOV × cfg.CAM_Z_SPHERE` reads `BREAKPOINTS.md`, and
   `usesCylinderGeometry('md')` is true on `pointer: coarse`. So md's camera distance also sets the
   **iPad barrel's** column-solve budget. 65 → 60 cut it 7.7%, which can tip the column count.
2. **Dissolve onset.** `zoomT` is a pure function of scroll (`timeline.js:158`) so nothing re-times —
   but `camZAtZoomT` uses `easeOutCubic`, whose derivative at `t=0` is **3**, so the camera covers
   ground fast at the start of the zoom. 65 → 60 moved the first dissolve from zoomT 0.031 to 0.018
   (**~40% sooner in the scroll**); the solid globe holds for a shorter stretch. `NEAR_FADE_START`
   2.2 → 1.7 puts it back at ~0.030. `pqAppearZoomT` also shifted 0.334 → 0.325 (~3% earlier),
   which is derived and self-consistent — nothing to fix there.

---

## Incoming ideas → where they landed

Suggestions from others, reconciled against the list and the README:

| Suggestion | Verdict |
|---|---|
| "Cards lacking texture — add border, shadow, button-ish feeling" | Mostly covered by **5** (lit rim) + **6** (inner AO). Split out the genuinely new parts as **11**: a constant-width authored border and a hover affordance. **Drop shadow specifically is a bad fit** — see 11. |
| "Make cards bigger to reduce gaps in globe" | **New — item 9, and the strongest item on the list.** The README already names this exact lever and it was only ever pulled on sm. |
| "More dynamic layout like grid — some cards larger, some tilted differently" | **Tilt half is already shipped**: `CARD_ROLL_JITTER: 0.5` on md (±14°) is deliberately the loose "collage" setting. **Size half is new — item 10.** |

---

## 1. Per-card directional shading (N·L)

**What.** Cards are flat, so the normal is constant per card — this is a *CPU scalar*, not a
per-pixel light. Compute `cardNormal` in `placeSphereCard`, dot with a key-light direction, pass as
`uShade`, and `outCol *= uShade` in the frag.

**Cost — complexity.** ~8 lines. Lift the 2 `cardNormal` lines out of `applySphereFacing` (which
early-returns on md) into `placeSphereCard` so both this and item 5 can share them.

**Cost — perf.** One `Vector3.applyQuaternion` per card per frame (~24) + one uniform write + one
`vec3` multiply per fragment. Negligible.

**Benefit.** Very high. Turns a flat scatter into a shaded volume — the limb reads as curving away
instead of as more foreground.

**Risk.** Darkening photos hurts content legibility. Keep the range tight (~0.78 → 1.0) and consider
tinting toward the background colour rather than toward black.

**Touches.** `globe-gallery.js` `placeSphereCard`, `applySphereFacing`; `src/shaders.js` `CARD_FRAG`;
`src/materials.js` uniform decl.

---

## 2. Depth fog / atmospheric recession — REJECTED

**What.** Mix card colour toward `--s2a-color-gray-900` as a function of camera depth, so the back
of the sphere recedes.

**Cost — complexity.** ~6 lines. `depth` is **already computed** in `placeSphereCard` for `proxFade`,
so this is just a second scalar off a value in hand.

**Cost — perf.** One uniform + one `mix()` per fragment. Negligible.

**Benefit.** Very high — on a dark background this is the strongest depth cue available. It also
fixes a real compositional problem: back cards currently compete for attention with front cards,
which is a large part of what flattens the sphere into a scatter.

**Risk.** Must not fight `proxFade`. They sit at opposite ends of the depth range, so compose them
the way the existing code already does (`Math.min(proxFade ** NEAR_FADE_OPACITY_BIAS, revealT)`).

**Touches.** `globe-gallery.js` `placeSphereCard`; `src/shaders.js` `CARD_FRAG`; `src/materials.js`.

### As built

`uFog` (scalar) + `uFogColor` (vec3) on the card material; the frag folds the mix into the existing
`gl_FragColor` line. `uFog` is reset to 0 in the same per-frame block as `uDisperse`, so every other
phase is untouched. Ramp is `bp.FOG × clamp01((depth - fogNear) / fogSpan)`, with `fogNear` and
`fogSpan` derived in `recomputeDragFlip` off the `maxRadial` it already computes.

At rest (`CAM_Z_SPHERE 60`, `SPHERE_R 35`): front `fog 0.000`, centre `0.275`, back `0.550`.

**Four decisions worth not re-litigating:**

- **Colour mix, not alpha fade.** Alpha fade was one line and needed no shader change, but
  overlapping cards accumulate transparency — and overlap is about to *increase* (`CARD_H_SPHERE` is
  now 8.5, and item 3 adds radius jitter). Colour fog makes cards recede without dissolving.
- **Fog colour is read from the live computed background**, not hardcoded from
  `--s2a-color-gray-900` (`#131313`), so it cannot drift from CSS.
- **Plain `Vector3` uniform, not `THREE.Color`.** `THREE.Color.setStyle` converts to linear working
  space by default; the mix happens *after* the frag's `pow(1/2.2)`, i.e. in display space, so raw
  components are what is wanted. Using a Vector3 sidesteps the colour-space question rather than
  commenting around it. One shared instance backs every card material.
- **Scoped through `shape`, not `cfg`.** `FOG: cfg.FOG` would have fogged the **iPad barrel**
  (md-touch reads `BREAKPOINTS.md`). Routed through `shape` like `CARD_FACE_CAMERA`, so
  `YAW_ONLY_GEOMETRY.FOG = 0` keeps both barrel paths untouched.

**Free side-effect:** keying off camera depth rather than sphere-local z means fog *lifts* during the
fly-through as depths shrink — the far side brightens as you approach it.

**Dial:** `BREAKPOINTS.md.FOG`.

### Outcome: built, reviewed, reverted

Two independent problems, only one of which was fixable:

1. **Per-object uniform, but fog is per-fragment.** Each card took one flat value from its centre
   depth. Measured at rest, n=24: touching neighbours differed by up to **0.185 — a hard-edged 34%
   brightness jump across a card seam** — and each card stepped independently as the sphere turned.
   Visible as cards "lighting on/off one by one." **Fixable** (pass view-space z as a varying; it
   would have *removed* the per-card per-frame uniform write, so not more code).
2. **The cue is structurally weak on a `#131313` background** — see the section at the top. Fogging
   toward near-black is dimming. Per-fragment would have fixed the popping, not the "just darker"
   read.

Reverted rather than fixed: (2) does not go away, and the lines are better spent on 3 / 4 / 5.
The implementation is in git if the background ever changes.

**My error in the original ranking:** rated "very high" benefit without accounting for the background
colour. The reasoning ("strongest depth cue available on a dark background") had it exactly backwards.

---

## 3. Radius jitter — break the perfect shell

**What.** `fibSpherePos` puts every card at exactly `SPHERE_R`. Multiply by
`1 + (Math.random() - 0.5) * 0.08` so the shell becomes a *cloud of objects* with genuine overlap
and parallax during rotation.

**Cost — complexity.** One line, at build time. No shader work, no picking impact.
`maxRadial` / `dragFlipZ` / `fadeRefH` are all derived from the cards, so they self-adjust.

**Cost — perf.** Zero runtime cost. Slight fill-rate increase: more card-on-card overlap on a
`depthWrite: false` transparent stack means a bit more overdraw. Should be lost in the noise at 24
cards, but it's the one item here with any perf direction at all.

**Benefit.** High, and it's free. Overlap and parallax are the strongest volumetric cues the eye has.

**Risk.** Cards can visibly intersect. Needs a tuned amount — start ±4%, walk up.

**Touches.** `globe-gallery.js` `buildCards` / `fibSpherePos` call site.

---

## 4. Cheap depth-of-field via texture mip bias

**What.** `texture2D(uMap, uv, uBlur)` with a depth-driven positive LOD bias, so distant cards
sample a blurrier mip.

**Explicitly NOT real DOF.** True DOF needs `EffectComposer` + render targets — a genuine
architectural addition to a file that does exactly one forward pass, plus it would fight the CSS SVG
CA filter on the canvas. Different tier of cost; not on this list.

**Cost — complexity.** ~4 lines. The three CA fetches (R/G/B) each take the bias.

**Cost — perf.** Net **win** — blurrier mips on distant cards are more texture-cache coherent than
full-res fetches.

**Benefit.** High. Sharpness falloff with depth is a large part of what makes CG read as
photographic rather than diagrammatic.

**Risk / unknowns.**
- **Verify the 3-arg `texture2D` compiles under this setup before committing.** Three emits GLSL ES
  1.00 by default; the bias overload is core there for fragment shaders, and WebGL2 accepts ES 1.00
  shaders — but confirm, don't assume.
- Card textures are `CanvasTexture` with three's defaults (`generateMipmaps: true`,
  `minFilter: LinearMipmapLinearFilter`), so mips should exist. NPOT canvas dimensions mip fine under
  WebGL2; check the WebGL1 fallback path doesn't silently lose them.
- Mip blur is quantized between levels and can read mushy rather than bokeh. Subtle amounts only.

**Touches.** `src/shaders.js` `CARD_FRAG`; `src/materials.js`; `globe-gallery.js` `placeSphereCard`.

---

## 5. Fake edge / thickness (lit rim)

**What.** Make cards read as physical objects that catch light on their edge, rather than as
infinitely thin decals that vanish at grazing angles.

**Rejected sub-option: real geometry.** A `BoxGeometry` / extrusion would break the 2D rounded-rect
SDF, the dispersion shader, and the modal's mesh reuse. Not worth it.

**Chosen approach.** `CARD_FRAG` already computes
`float stroke = 1.0 - smoothstep(0.0, px * 1.5, abs(dsd));` and currently uses it **only** for the
pre-reveal contour. Reuse it as a lit rim scaled by view obliquity (`|normal · viewDir|` — another
CPU scalar, shares the `cardNormal` from item 1).

**Cost — complexity.** ~10 lines, most of which is already written.

**Cost — perf.** ~3 ALU ops per fragment. Negligible.

**Benefit.** Medium-high. Directly attacks the "sticker" read, and is most visible exactly where the
sphere currently looks worst — the limb.

**Risk.** Can look like a cheap outline if the obliquity gate is too weak. Must fade to nothing at
face-on.

**Touches.** `src/shaders.js` `CARD_FRAG`; `globe-gallery.js` `placeSphereCard`.

---

## 6. Inner-shadow AO at card edges

**What.** Darken the outer few percent inward from `dsd` so cards read as lifted objects with a soft
contact edge.

**Cost — complexity.** ~3 lines — one extra `smoothstep` on a distance value already in hand.

**Cost — perf.** One `smoothstep` per fragment. Negligible.

**Benefit.** Medium. Small on its own; pairs naturally with item 5 and the two together are worth
more than the sum.

**Risk.** Low. Overdone, it looks like a vignette on every photo.

**Touches.** `src/shaders.js` `CARD_FRAG`.

---

## 7. Specular sheen sweep

**What.** A highlight that travels across cards as the sphere rotates. CPU `reflect()` term per card
+ a gradient in the frag.

**Cost — complexity.** ~12 lines.

**Cost — perf.** Negligible.

**Benefit.** Medium — adds a sense of *material* to what currently reads as printed paper.

**Risk.** Real gimmick risk, and it tints the photos. **Held back deliberately** — revisit only after
1/2/3 land and only if the surface still reads as matte paper.

**Touches.** `src/shaders.js` `CARD_FRAG`; `globe-gallery.js` `placeSphereCard`.

---

## 8. Curve the cards to the sphere — deprioritized

**What.** Bend each card into a patch of the sphere/barrel surface via a subdivided plane + a
vertex-shader bend on a `uBend` uniform (arc-length parameterized, horizontal-only).

**Why deprioritized.** Measured half-angle on the **md sphere is only ~8°** (R 35, card width
`6.5 × srcAspect`) — sagitta ~0.34 world units on a 6.5-tall card, ~5%. Barely visible. This was the
original hypothesis for the low-fidelity read and the numbers don't support it there.

**Where it WOULD pay:** the sm barrel — ~37° half-angle at 4 columns (R 16), sagitta ~3.3 units on a
~21-wide card. A 4-column barrel is literally a square prism. **But that path already reads fine**,
so this is parked, not dead.

**Cost — complexity.** ~30 lines: `PlaneGeometry(w, h, 1, 1)` → `(w, h, 16, 1)`; store per-card
`bendAngle`; `uBend` uniform multiplied by `fdE`; and `mesh.scale.z` must track `scale.x`
(`globe-gallery.js:1381` and `:710` — `scale.z` is inert today so this is safe). Ordering detail:
`CARD_DISPERSE_VERT` already writes `position.xy * grow`, and the bend must apply to the *grown* x
or the dispersion overscan un-bends the edges.

**Cost — perf.** Trivial: 24 cards × 34 verts vs 96 total.

**Cost — the real one: picking goes stale.** `src/interaction.js:123` raycasts the CPU geometry,
which stays flat, so the hit region is the chord and `hits[0].uv` (→ `uHoverPos` warp anchor) drifts.
Negligible at 8°; material at 37°. Fix if needed is an analytic cylinder-patch `mesh.raycast`
override (~25 lines, gives exact UV).

**Texture mapping is NOT a problem** — a horizontal-only bend is developable (zero Gaussian
curvature), so the image maps isometrically. The rounded-rect SDF, `coverFit` crop, dissolve/disperse
and CA all run on `vUv` and are untouched; `fwidth` AA auto-compensates. The one requirement is
**arc-length** parameterization (angle ∝ u); chord parameterization compresses the texture toward the
edges by 1/cos θ.

**Free side-benefits if it's ever revived on the barrel.** A curved card never collapses to a pure
sliver, which may let `CARD_FACE_CAMERA` drop back toward 0 and recover the barrel curve the README
says it currently costs. And a bent card's chord footprint is ~6% narrower at 37°, buying back
`CYL_BULGE` edge-overlap headroom.

---

## 9. Card size ↑ on md (the sparseness lever)

**What.** Raise `BREAKPOINTS.md.CARD_H_SPHERE` (currently `6.5`). Coverage scales with **H²**, so
size is a far stronger lever than card count — and per the README, adding cards actively hurts
("nearest-neighbour spacing is already even at N=24 and worsens with more cards").

**This lever is already documented, and was only ever pulled on sm.** The README's density pass lists
"Sparseness → `BREAKPOINTS.sm.CARD_H_SPHERE` (sphere path only)". sm got `11.0`; **md is still at the
un-tuned `6.5`.** Back when sm was a sphere it was taken to a measured "~42% of the sphere face."

**How much headroom (measured).**
- `H/R`: md = `6.5/35` = **0.186**. sm = `11/16` = **0.688**. That is 3.7× in linear terms, and
  coverage goes as `(H/R)²` — so **md is ~13.6× sparser than the value sm was actually tuned to.**
- Fibonacci nearest-neighbour spacing at N=24, R=35 is `R·√(4π/N)` ≈ **25.3 world units**, against a
  card height of **6.5**. Roughly **3.9× linear headroom** before neighbours touch.
- Total sphere-area coverage today ≈ **6.6%**. You can see straight through to the back, which is a
  large part of why there is no sense of a *surface*.

**Cost — complexity. One constant.** And it is cleanly isolated to the sphere phase:
`computeGridLayout` sets `card.gridScale = gridCardW / CARD_W_SPHERE`, so the grid **self-normalizes**
and stays pixel-identical. The arc phase sizes off `CARD_W_ARC` independently. `fadeRefH`,
`dragFlipZ` and `cardVanishDepth` are all derived from live card heights, so they self-adjust too.

**Cost — perf. This is the real one, and the largest on the list.** Fill rate scales with H² across
24 overlapping cards on a `depthWrite: false` transparent stack. At 2× size that is ~4× the sphere-phase
fill. Measure this one rather than eyeballing it.

**Texture headroom is fine.** A front card is ~190 CSS px today; ~380 at 2×, ~570 at 3× — all under
`CARD_TEX_MD` 768. No texture change needed until well past 3×.

**Coupling — watch `CARD_ROLL_JITTER`.** The README notes the roll spread is density-dependent: at
sm's density md's `0.5` "reads as debris," while at md's current sparsity it "keeps the collage
character." **Raising H raises density, so 0.5 may start reading as debris** and want to come down.
Retune the two together, not independently.

**Synergy.** Bigger cards overlap more in projection, and occlusion is a strong depth cue — so this
compounds with item 3 (radius jitter) rather than competing with it.

**Touches.** `BREAKPOINTS.md.CARD_H_SPHERE`. Possibly `BREAKPOINTS.md.CARD_ROLL_JITTER`.

---

## 10. Deliberate per-card size variety

**What.** Today `sphereScaleSX = srcAspect / CARD_ASPECT` and `sphereScaleSY = 1` — cards vary in
**width** by source aspect but **every card is exactly the same height**. Add a controlled per-card
random scale multiplier, as a `sphereScales` array built alongside the existing `gridTilts`.

**Important reconciliation with the README.** The README treats the *existing* size variance as a
**bug**, not a feature: native-aspect sizing makes a 16:9 image 2.67× the area of a 2:3 one, so "wide
cards can blot out neighbours," and it proposes an area-normalizing dial — scale both axes by
`(srcAspect / CARD_ASPECT)^-norm`, equalizing at `norm = 0.5` with the aspect and the image
undistorted. Those two positions are compatible, and the right sequencing is:
**normalize the accidental variance first, then add deliberate variance on top.** Random variance
layered over a 2.67× accidental spread is just noise.

**Use a uniform multiplier only.** `applyCardFit` derives `uAspect` from `mesh.scale.x / mesh.scale.y`,
so a uniform per-card scale is free (aspect unchanged, crop unchanged). A non-uniform one silently
changes the cover-crop.

**Cost — complexity.** ~5 lines, plus one mandatory mirror. **Gotcha, straight from the README: any
sphere-scale change must also be applied in `modal.js`'s close target, or the card jumps when
`snapToSphereSlot` runs.** Also note `placeSphereCard` (`:1381`) and `snapCardToSphereSlot` (`:710`)
both set scale and must agree.

**Cost — perf.** Negligible (build-time array + existing per-frame scale write).

**Benefit.** Medium-high. Uniform sizing is a big part of the mechanical, decal-like read — this is
the direct fix for "just laid there."

**Risk.** Works against the even-distribution property the Fibonacci layout was chosen for, and the
README's density pass explicitly fought an "unevenly distributed" read. Start narrow (±15%) and
treat widening as a deliberate trade against evenness.

**Touches.** `globe-gallery.js` `buildCards`, `updateCardSphereSizing`, `placeSphereCard`,
`snapCardToSphereSlot`; `src/modal.js` close target.

---

## 11. Border / "button-ish" treatment

**What.** The surface-treatment half of the "cards lack texture" suggestion, minus what items 5 and 6
already cover.

**(a) Constant-width authored border — the part worth doing.** A thin light stroke at a fixed width,
**not** obliquity-gated (that is item 5's job — the two are complementary, not duplicates). Reuses the
`stroke` term `CARD_FRAG` already computes. On a `gray-900` background a light stroke is what actually
separates a card from the void.

**(b) Hover affordance.** Hover is already fairly strong — `HOVER_SCALE 0.25`, `HOVER_WARP 0.4`,
`HOVER_CA 0.025`. What is missing is a *state* change rather than a *deformation*: brighten the
border on hover. Cheap, and it is what sells "button."

**(c) Outer drop shadow — recommend against.** Two independent reasons:
1. On `--s2a-color-gray-900` a dark shadow barely registers. The background is already nearly black.
2. It needs alpha **outside** the rounded rect, so the plane must overscan. A precedent exists
   (`CARD_DISPERSE_VERT` already grows the plane for dispersion), but it means extra fill on an
   already-transparent `depthWrite: false` stack of 24 overlapping cards — and item 9 is about to make
   that stack much more expensive.

A light border buys the same separation for a fraction of the cost. If depth-separation is the real
goal, items 1/2/4 buy far more of it than a shadow would.

**Cost — complexity.** ~6 lines for (a) + (b).

**Cost — perf.** Negligible.

**Benefit.** Medium — and it is the cheapest item that addresses the literal complaint.

**Touches.** `src/shaders.js` `CARD_FRAG`; `globe-gallery.js` `placeSphereCard` for the hover state.

---

## 12. Fibonacci pole sampling (midpoint)

**The observed symptom:** the first few cards, at the north pole, read as clustered/messy.
**This is NOT the inherent Fibonacci-sphere problem** (that one is a mild nearest-neighbour
irregularity near the poles, and it is not what is visible here). Three specific, separately fixable
things are stacked on that spot:

**(a) Endpoint instead of midpoint sampling — one line.** `fibSpherePos` uses

```js
polarAngle = acos(1 - (2 * i) / total)
```

At `i = 0` that is `acos(1)` = **exactly the north pole**, and the last card lands at `-1 + 2/n`, so
the south pole is left bare. The distribution is asymmetric. The standard form samples cell
*centres*: `1 - (2i + 1) / total`. Effect at n=24, top three polar angles:

| | i=0 | i=1 | i=2 |
|---|---|---|---|
| today (`2i/n`) | **0.0°** | 23.6° | 33.6° |
| midpoint (`(2i+1)/n`) | 16.6° | 29.0° | 37.7° |

No card on the singular point, gaps of 12.4°/8.7° instead of 23.6°/10.0°, and both poles symmetric.
For small n an ε-offset variant (Marques et al.) buys a bit more minimum-separation; worth trying
since it is the same one line.

**(b) `lookAt` degeneracy at the pole — turned out to be SUBSUMED by (a); see the note below.** `Matrix4.lookAt` does
`crossVectors(up, z)` and, when that is zero, nudges `z.z += 1e-4` and continues (confirmed in
`three.module.min.js`). `buildCards` passes `up = (0,1,0)` and a pole card's normal **is** `(0,1,0)`,
so the guard fires and that card's roll is decided entirely by a 1e-4 fudge — arbitrary, not chosen.
Worse, *near* the pole the tangent frame is ill-conditioned, so roll swings hard between adjacent
cards. Fix (a) removes the exact-pole case; near-pole cards want a stable up (blend toward `(0,0,1)`
as `|normal.y| → 1`). ~4 lines.

**(c) The cards up there are edge-on slivers — see item 13.** Probably the largest visual
contributor, and not a placement problem at all.

**Cost.** One line, no constant: `y = 1 - (2 * i + 1) / total`. No perf cost — `fibSpherePos` is
build-time only. The tunable ε form (`(i + eps)` over `(n - 1 + 2*eps)`, ~1.33 for a wider bald cap
at low counts, Marques et al.) collapses to exactly this at eps = 0.5 and is not in the code.

**Risk.** (a) changes every card's position, so anything cached off `spherePos` re-solves — but
`maxRadial`, `fadeRefH` and `dragFlipZ` are all derived, and there is no persisted layout.

**Touches.** `globe-gallery.js` `fibSpherePos`.

### Note: (b) was implemented, then deleted — (a) already covers it

A `sphereUp()` helper blended the `lookAt` reference toward +Z across a `POLE_UP_BAND`. It is gone.
Two reasons, both measured:

1. **The degeneracy it guarded cannot occur once (a) lands.** With centre sampling the most polar
   card sits 16.6° out at n=24, so `|cross(up, normal)|` is 0.286 — and still 0.158 at n=80. Three's
   guard fires only at exactly 0. The justification evaporated.
2. **The roll-coherence claim did not survive measurement.** Twist mismatch between neighbouring
   cards (parallel-transport one frame to the other, compare roll — higher = more "spokey"):

   | scheme | top-4 max | top-4 mean | sphere max | sphere mean |
   |---|---|---|---|---|
   | `lookAt` + world up | 135° | 52° | 135° | 27° |
   | + `POLE_UP_BAND` | **153°** | 46° | **153°** | 28° |
   | `setFromUnitVectors(+Z, n)` | 103° | 40° | 164° | **41°** |

   The band made the top-4 **worst case worse** for a 6° mean gain. The visual win the user saw was
   (a).

**The framing worth keeping:** a tangent frame cannot be combed continuously over a sphere, so this
roll singularity can only be **moved**, never removed. `lookAt` + world up puts one at each pole;
`setFromUnitVectors(+Z, normal)` (the minimal zero-twist rotation) leaves exactly one, on the card
facing directly away from the camera. That is a **character change, not a fix** — it trades pole
coherence (135° → 103° top-4 max) for globally looser roll (27° → 41° mean), which cuts against the
deliberate "collage" read of `CARD_ROLL_JITTER: 0.5`. Available if the poles ever need more; not
worth taking blind.

---

## 13. `CARD_FACE_CAMERA` > 0 on the md sphere — REJECTED

**What.** md's full-sphere path runs `CARD_FACE_CAMERA: 0`, so cards face strictly radially outward.
A radial card's obliquity equals its angular distance from front-centre, so **limb and pole cards
render as lines.** The README's own measurement on the full-sphere path: `applyCardFacing` takes
**slivers 5 → 0** and worst obliquity **81° → 41°**.

**Why this is likely mistuned rather than deliberate.** The dial's documented costs — cards "popping
up," apparent self-spin near the limb, and cancelling each card's vertical slope — are all analysed
in the README **specifically for the barrel**, where the re-aim fights `cylinderMasonryLayout`'s
bulge normals. The sphere path has no vertical slope to cancel (cards are radial by definition), so
most of that cost does not apply. This looks like the same situation as item 9: a documented lever
that was only ever pulled on the other path.

**Cost — complexity. One constant** — but note `applySphereFacing` is applied at **three** sites that
must agree or cards snap: `placeSphereCard`, `snapCardToSphereSlot`, `placeFoldingCard`. They already
agree today; just don't add a fourth.

**Cost — perf.** None. The function already runs every frame and early-returns on `!k`.

**Benefit.** High, and it targets exactly the region the user flagged. Pole cards stop being slivers.

**Risk.** `FACING_EDGE_ON_BAND` (0.25) is shared, but the README notes **no sphere path reads it
today**, so it is free to retune here. Start low (0.10–0.15) and watch for the "pop" symptom.

**Touches.** `BREAKPOINTS.md.CARD_FACE_CAMERA` (currently sourced from `cfg` on the sphere path).

### Outcome: tried at `0.4`, reverted to `0`

**Cards visibly turn on their own as the sphere rotates.** Unacceptable — it reads as a bug, and it
costs more than the slivers it fixes.

**Where the prediction went wrong.** The README gives the "popping up / self-spin" symptom two
causes, and I only checked one of them:
1. The re-aim partly cancels each card's **vertical slope** — genuinely barrel-specific
   (`cylinderMasonryLayout`'s bulge normals). Does not apply to a radial sphere card. ✅ correct.
2. The re-aim **"unwinds much faster than it winds up once `|n.z|` enters the edge-on band."** This
   is a property of `FACING_EDGE_ON_BAND`'s gating, **not** of the barrel's geometry — so the sphere
   path inherits it in full. ❌ missed.

Cause 2 is the one that bites, and it is why `0` is the tuned value rather than an untried one.

**What would have to change first.** The self-spin is an asymmetry in how `k` ramps across the
edge-on band, so the dial is not reachable until that is fixed — e.g. rate-limit `k`'s per-frame
change, or drive the fade off a quantity that does not flip sign at the limb. That is a real change,
not a constant. **Do not reopen this as a tuning exercise.**

**Standing note:** the limb slivers this was meant to fix are still there. If they matter, they need a
different mechanism.

---

## Log

| Date | Item | Outcome / notes |
|------|------|-----------------|
| 2026-08-23 | — | Doc created. Diagnosis: unlit + no depth cue + coplanar shell, not curvature. |
| 2026-08-23 | 9, 10, 11 | Added from others' suggestions. Tilt-variety idea found already shipped (`CARD_ROLL_JITTER` 0.5 md). Item 9 promoted to first experiment. |
| 2026-08-23 | **9 — shipped** | `BREAKPOINTS.md.CARD_H_SPHERE` 6.5 → **8.5**. Instantly better. Side-effect: raised the near-fade floor 49.3 → 53.7, spending ~4.4 units of camera headroom. |
| 2026-08-23 | camera | `BREAKPOINTS.md.CAM_Z_SPHERE` 65 → **60**. Scroll timing unaffected (`zoomT` is pure scroll); dissolve onset moved ~40% sooner in scroll. Open: whether to compensate with `NEAR_FADE_START` 2.2 → 1.7, and an iPad column-count check. |
| 2026-08-23 | 12, 13 | Added from the north-pole clustering question. Diagnosis: endpoint sampling puts a card on the singular pole, `lookAt` degenerates there, and ~5 cards are edge-on slivers because md runs `CARD_FACE_CAMERA: 0`. |
| 2026-08-23 | 12 + 13 — implemented | `CARD_FACE_CAMERA` 0 → 0.4; `FIB_POLE_EPS 0.5` (midpoint sampling); `sphereUp()` blends the lookAt reference to +Z across `POLE_UP_BAND 0.35`. Verified numerically: top card 0.0° → 16.6° polar, poles now symmetric (16.6° from each), worst `\|cross(up, normal)\|` 0 → 0.154 across n=12–40. Lint clean. **Decided against size-aware placement** — a Fibonacci sphere is equal-area by construction, so there is no "more room" to allocate; area-normalize the cards instead (item 10). |
| 2026-08-23 | **13 — rejected** | `CARD_FACE_CAMERA` 0.4 → back to **0**. Cards visibly self-spin. My call that the README's barrel-specific costs wouldn't apply to the sphere was half wrong: the vertical-slope cause is barrel-only, but the edge-on-band wind-up/unwind asymmetry is not, and that is the one that shows. Needs a mechanism change, not a value. |
| 2026-08-23 | **12 — kept** | Pole sampling + `sphereUp` blend retained. |
| 2026-08-23 | **12 — simplified** | Deleted `POLE_UP_BAND` / `sphereUp()` (12b); kept midpoint sampling (12a). 12b was justified on a `lookAt` degeneracy that **12a already removes** — with centre sampling the most polar card sits 16.6° out, leaving `\|cross(up, normal)\| >= 0.16` up to n=80, never 0. Measured neighbour twist-mismatch also failed to support it: top-4 max got **worse** (135° → 153°) for a 6° mean gain. Net −12 lines, 3 constants gone. |
| 2026-08-23 | comments | Stripped every comment our changes added to `globe-gallery.js` (shipped unminified). `FIB_POLE_EPS` collapsed to the inline `1 - (2i + 1)/n`; `CARD_FACE_CAMERA` line restored verbatim. One current-behaviour bullet moved to README (cell-centred sampling ↔ world-up coupling). **Standing rule for the rest of this list: no comments in js/css; README gets only tricky current behaviour, never rationale or history; this doc holds the archaeology.** |
| 2026-08-23 | **2 — implemented, awaiting visual check** | Depth fog. 19 lines, zero comments. `BREAKPOINTS.md.FOG 0.55`; barrel paths gated to 0 via `shape`. Fog colour read from the computed background. |
| 2026-08-23 | **2 — rejected** | Built, reviewed, reverted. Per-object fog quantized into flat tiles (0.185 step across a touching-neighbour seam) that step independently as the sphere turns — fixable. Not fixable: on `#131313`, fog toward the background IS dimming. Code reverted from all three files; doc keeps the reasoning. Re-ranked the remaining list around what works on a black field. |
