# build-scroll-animation

Builds CSS-driven scroll animations for C2 blocks. Given a block (from `libs/c2/blocks/`) and animation instructions from the design squad, either recommends existing `parallax-*` classes or creates new ones using the Scroll-Driven Animations API, verifies with Playwright, and self-critiques for simplicity.

All animation CSS lives inside the `@supports (animation-timeline: view())` block in `libs/c2/styles/styles.css`. The skill does not create separate CSS files for animations.

---

## Prerequisites

### MCPs

| MCP | Notes |
|-----|-------|
| Playwright | Browser automation for animation verification. |

**Playwright**

```sh
claude mcp add playwright npx @playwright/mcp@latest --scope user
```

After adding the MCP, close and reopen Claude, then run `/mcp` to confirm the connection is active.

---

## Run

```
/build-scroll-animation
```

The skill will prompt for:

| Input | Required | Example |
|-------|----------|---------|
| Block name | Yes | `base-card`, `rich-content` |
| Preview URL | Yes | `http://localhost:6456/some-page` |
| Animation instructions | Yes | "Cards should fade in and slide up as they enter the viewport, staggered left to right" |
| Visual reference | No | Figma URL or screenshots of animation states (start / mid / end). Video files are not accepted. |
| Target element | No | Defaults to the block element itself |
| Breakpoint-specific behavior | No | "Desktop only" or "Different range on mobile" |

## Output

Either a recommendation to use existing `parallax-*` classes, or new CSS appended inside the `@supports (animation-timeline: view())` block in `libs/c2/styles/styles.css`. The final summary includes the simplicity-review verdict, Playwright verification results per breakpoint, and reduced-motion compliance status.
