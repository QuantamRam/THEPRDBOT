---
name: website-self-review
description: Audits and iteratively improves a website the agent has just built from a raw user prompt. Use this skill after any website, landing page, or web app build is first complete, and whenever the user asks to review, polish, fix, or improve a site. It finds what works, what is broken, what is misplaced, and what needs improvement, then fixes issues in ranked order, with a hard limit of 5 improvement passes so it never loops forever.
---

# Website Self-Review and Improve (max 5 passes)

The agent builds from a rough prompt but cannot see its own mistakes. This skill makes it look at the result honestly, write down what is working and what is not, fix the most important problems, and stop after 5 passes.

## Hard rule: the pass limit

- Keep a counter: `PASS = 0`.
- Each full cycle (Inspect, Diagnose, Fix, Verify) adds 1 to `PASS`.
- **Never run more than 5 passes.** When `PASS = 5`, stop and write the final report, even if issues remain. List the unfixed issues in the report instead of fixing them.
- Stop earlier if any of these is true:
  - No Critical or Major issues remain.
  - The last pass gave no real improvement (the same issues are still listed).
  - A fix would only change personal taste and not quality.
- Never start a "bonus" pass. Never reset the counter.
- Store the counter and logs in `REVIEW_LOG.md` in the project root so the limit survives across steps.

## Step 0: Understand the goal (once, before pass 1)

Re-read the user's original prompt. Write 3 to 5 lines in `REVIEW_LOG.md`:

- Who the site is for
- What the site must do (main action: buy, sign up, read, contact)
- The mood or style the user asked for (or imply one if they did not say)

Every judgement later is measured against this, not against random preference.

## Step 1: Inspect (see the site as a user would)

Do not judge from code alone. Open the site and look at it.

1. Start the dev server and open the page in the browser tool.
2. Take screenshots at **desktop (1440px)**, **tablet (768px)**, and **mobile (375px)**.
3. Scroll the full page. Click every button, link, menu, form, and tab.
4. Check the browser console and terminal for errors and warnings.
5. Check that images load, fonts load, and links go somewhere real.

## Step 2: Diagnose (write it down)

Add a section to `REVIEW_LOG.md` for this pass using the template below. Be specific: name the section, element, and file.

```
## Pass N

### Working well
- (things to keep, so the next pass does not break them)

### Not working
- [Critical|Major|Minor] <what> | where: <section/file> | why: <cause>

### Misplaced or badly arranged
- <element> is at <place>, should be at <place> because <reason>

### Needs improvement
- <area>: <what is weak> -> <what would be better>
```

Check each of these areas:

| Area | Questions to ask |
|---|---|
| **Function** | Do all buttons, links, forms, menus work? Any console errors? Any broken images or 404s? |
| **Layout and placement** | Is the most important thing at the top? Is the main call-to-action visible without scrolling? Is the section order logical? Anything overlapping, cut off, or misaligned? |
| **Responsive** | Does it break at 375px or 768px? Horizontal scroll? Text too small to read? Tap targets too small? |
| **Visual design** | Consistent colors, fonts, spacing? Clear hierarchy (one obvious heading, then subheadings, then body)? Enough whitespace? Does it match the mood from Step 0? |
| **Content** | Real, relevant copy instead of lorem ipsum or filler? Headlines that say something specific? Realistic placeholders for images? |
| **Accessibility** | Enough text contrast? Alt text on images? Keyboard focus visible? Labels on form fields? |
| **Performance** | Huge images? Layout jumping while loading? Unused heavy libraries? |
| **Polish** | Hover and focus states, smooth transitions, favicon, page title, 404 handling, empty states |

### Severity

- **Critical**: something is broken or unusable (crash, dead button, unreadable text, blocked main action).
- **Major**: clearly hurts the experience or the goal (bad placement of the main CTA, broken mobile layout, inconsistent style).
- **Minor**: small polish.

## Step 3: Improve (using good taste)

Fix in this order: Critical, then Major, then Minor. Do as many as fit comfortably in one pass.

Taste rules to apply when something is a design choice, not a bug:

- **Pick one direction and commit.** One type pairing (a heading font and a body font), a small palette (1 main color, 1 accent, neutrals), one spacing scale.
- **Hierarchy over decoration.** Make the most important thing the biggest or boldest. Remove things that compete with it.
- **Space is a feature.** If a section feels crowded, add padding before adding anything new.
- **Avoid generic defaults.** No default system-blue buttons, no random gradients, no stock-looking centered-everything layout unless it fits the goal.
- **Fewer, better elements.** Prefer deleting a weak section to polishing it.
- **Consistency.** Same button style, corner radius, and shadow everywhere.
- **Fit the audience.** A law firm and a skate shop should not look alike.

Rules for making changes:

- Change what the diagnosis listed. Do not rewrite the whole site.
- Do not remove anything listed under "Working well".
- Do not add new features the user did not ask for.
- Prefer small, targeted edits over big rewrites.

## Step 4: Verify

1. Reload the site and repeat the screenshots at all three widths.
2. Re-test every item that was marked Not working.
3. Confirm nothing from "Working well" broke.
4. In `REVIEW_LOG.md`, mark each issue `fixed`, `partly fixed`, or `not fixed`, then increase `PASS` by 1.
5. Decide: if `PASS < 5` and Critical or Major issues remain, go back to Step 1. Otherwise go to the final report.

## Final report

When stopping (for any reason), tell the user briefly:

1. **Passes used**: X of 5, and why it stopped (clean, no progress, or limit reached).
2. **What works**: 3 to 5 points.
3. **What was fixed**: grouped as Function, Layout, Design, Content.
4. **What is still open**: anything unfixed, with severity, so the user can decide.
5. **Suggestions for next time**: 2 or 3 ideas that would be worth a new request.

Keep it short and plain. Do not ask to continue improving automatically. Only start a new review cycle (with `PASS` reset to 0) if the user explicitly asks for one.

## Common mistakes to avoid

- Calling the site "great" without opening it and clicking through it.
- Fixing taste preferences while a button is still broken.
- Redoing the same change every pass (check `REVIEW_LOG.md` first).
- Letting the diagnosis list grow to 30 items. Keep the top 5 to 8 per pass.
- Going past 5 passes "just to finish".
