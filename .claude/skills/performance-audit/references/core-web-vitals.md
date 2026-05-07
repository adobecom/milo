# Core Web Vitals — Thresholds

Used by `agents/trace-analyser.md` to classify each metric.

## LCP — Largest Contentful Paint

Measures how long until the largest above-fold element is rendered.

| Rating | Value |
|--------|-------|
| Good | ≤ 2.5 s |
| Needs Improvement | 2.5 s – 4.0 s |
| Poor | > 4.0 s |

## CLS — Cumulative Layout Shift

Measures the total unexpected layout shift during the page lifecycle.

| Rating | Value |
|--------|-------|
| Good | ≤ 0.10 |
| Needs Improvement | 0.10 – 0.25 |
| Poor | > 0.25 |

## INP — Interaction to Next Paint

Measures the worst-case interaction latency (keyboard, pointer, touch).

| Rating | Value |
|--------|-------|
| Good | ≤ 200 ms |
| Needs Improvement | 200 ms – 500 ms |
| Poor | > 500 ms |

## FPS — Frames Per Second (scroll)

Not an official CWV but tracked alongside them.

| Rating | Value |
|--------|-------|
| Good | ≥ 60 fps |
| Needs Improvement | 30 – 59 fps |
| Poor | < 30 fps |

## Classification rules

- **CRITICAL** — Poor on both baseline and throttled passes
- **HIGH** — Poor on throttled, Needs Improvement on baseline; or > 100% regression between passes
- **MEDIUM** — Needs Improvement on one pass only
