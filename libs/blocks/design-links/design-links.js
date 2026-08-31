// The "Design Links" block is the hand-edited input table for the
// design-tracker skill (see .claude/skills/design-tracker/SKILL.md). Each row
// is a Figma design link plus an optional Jira link; the skill reads this
// block from the page's DA source on sync and reconciles the design-tracker
// dashboard below it. It's authored/edited in DA, so there's nothing to build
// at runtime — this decorator exists mainly so milo doesn't fail trying to
// load a module for the authored block. It just labels the table and opens
// links in a new tab.
export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    row.classList.add('design-links-row');
    // The first authored row is a "Figma / Jira" header, not a design.
    if (row === rows[0]) row.classList.add('design-links-head');
  });

  el.querySelectorAll('a').forEach((a) => {
    a.target = '_blank';
    a.rel = 'noopener';
  });
}
