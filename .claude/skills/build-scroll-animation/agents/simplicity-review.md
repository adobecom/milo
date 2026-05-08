# Simplicity Review Agent

This agent is delegated from Phase 4 of the main SKILL.md.
Its purpose is to critically evaluate whether the proposed
animation CSS is as simple as it can be.

---

## Inputs

The main skill provides:

1. The **animation instructions** from the design squad.
2. The **proposed CSS** (new classes, keyframes, variable overrides).
3. The **block's CSS file** path.

---

## Review procedure

### Step 1 — Can existing classes do this?

Read `references/existing-animations.md` and check whether the
desired effect is already achievable by composing existing
`parallax-*` classes.

**Output**: list of existing classes considered and why each does
or does not satisfy the requirement.

If existing classes suffice:
- **Verdict**: "Use existing classes. No new CSS needed."
- Provide the exact class combination.
- STOP here.

### Step 2 — Can variable overrides do this?

If the effect involves transform, opacity, scale, blur, or filter
but at different magnitudes or ranges, check whether overriding
`--parallax-*` variables in a single new class (with no new
keyframe) achieves the effect.

**Output**: the proposed variable-override-only class, or
explanation of why variable overrides are insufficient.

If variable overrides suffice:
- **Verdict**: "Use variable override. No new keyframe needed."
- Provide the minimal class definition.
- STOP here.

### Step 3 — Review the proposed CSS

If new keyframes are required, evaluate:

#### 3a. Keyframe minimality
- Does the keyframe animate only properties that visibly change?
- Can any animated property be removed without affecting the
  visual result?
- Is `to` explicitly needed, or can it be omitted (defaulting to
  the element's natural state)?

#### 3b. Property choice
- Are all animated properties compositor-friendly (`transform`,
  `opacity`, `filter`)?
- If non-compositor properties are animated (`line-height`,
  `clip-path`, `width`, etc.), is this justified?
- Flag any property that triggers layout recalculation
  (`width`, `height`, `margin`, `padding`, `top`, `left`).

#### 3c. Animation count
- How many independent `animation-timeline` declarations are
  there across the component?
- If more than 3, flag as complex. Can any be consolidated?
- Can child animations be replaced by a parent animation with
  inherited transforms?

#### 3d. Range appropriateness
- Is the `animation-range` as narrow as possible?
- Could a narrower range produce the same visual effect?
- Are start and end range values sensible (start < end)?

#### 3e. Naming
- Does the class use the `parallax-` prefix? This is preferred.
  If not, was the non-standard name approved by the user? Is
  there an explicit `prefers-reduced-motion` override?
- Is the class name descriptive of the effect?

#### 3g. Easing
- Is the animation using `var(--parallax-easing)` (the project
  default)? If a different timing function is used, does the
  design spec explicitly call for it? If not, flag it.

#### 3f. Responsive considerations
- Does the animation work at all breakpoints, or is it
  desktop-only?
- If responsive, are breakpoint-specific values using
  CSS custom properties for clean overrides?

---

## Output format

```
Simplicity Review
─────────────────

Verdict: [Use existing classes / Use variable override / Approved / Needs simplification]

Existing classes considered:
- parallax-move-up: [applicable / not applicable because ...]
- parallax-opacity: [applicable / not applicable because ...]
- ...

Variable override feasibility: [Yes — here's the class / No because ...]

[If reviewing proposed CSS:]
Keyframe minimality:    [PASS / FAIL — detail]
Property choice:        [PASS / FAIL — detail]
Animation count:        [N timelines — OK / FLAG]
Range appropriateness:  [PASS / FAIL — detail]
Naming:                 [PASS / FAIL — detail]
Responsive:             [PASS / FAIL — detail]

Suggested simplifications:
1. ...
2. ...

Final CSS (if modified):
[the simplified CSS block]
```

---

## Iteration

If the verdict is "Needs simplification", the main skill applies
the suggested changes and re-submits for review. Maximum 2
review cycles. If the CSS passes on the second review, or if the
remaining complexity is inherent to the design requirement,
proceed.
