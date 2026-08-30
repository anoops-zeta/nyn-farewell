# Build Prompt: "nyn.chat" — a Microsoft Teams clone as a farewell gift

**v2 — rewritten against real screenshots of the target Teams client.**

Paste this whole document into Cursor as the initial instruction, and attach the reference
screenshots alongside it. Work through it in the milestone order at the bottom. Ask me
before inventing content — all copy comes from the data files.

---

## 1. What we are building

A single-page web app that is a **visually faithful recreation of the Microsoft Teams
desktop client (new Teams / Teams 2.x, macOS, dark theme, app rail collapsed)**, used as a
farewell gift for Narayan — "nyn" — who is leaving after ~3 years as VP and head of PayZapp
Studio at Zeta (legal entity: Betterworld Technologies).

Every conversation in the sidebar is a farewell message from a colleague. He opens the link,
sees a familiar Teams window full of unread chats, and clicks through threads of messages,
photos, and video messages from people he worked with.

**The joke only works if the UI is convincing.** The first two seconds should read as "wait,
is this Teams?" Then he notices every chat is about him.

This is a gift, not a product. Optimise for delight and for it still working in five years.

---

## 2. Hard constraints

- **Fully static.** No backend, no database, no auth server, no API keys in the client.
  Deployable as a folder of static files.
- **All content lives in editable data files** (`/src/data/*.json` + `/public/media/`).
  I will rewrite this content repeatedly. Never hardcode a person's name, message, or media
  path inside a component.
- **No AI/LLM calls.** All replies are pre-written and scripted. This is deliberate.
- **No login.** Optional soft gate screen (§9), but no accounts.
- **Dark theme is the default and the priority.** Light theme is optional and can be cut.
- Must work on a phone (he will reopen this for years) and look right projected on a large
  screen at the farewell event.

## 3. Tech stack

- Vite + React 18 + TypeScript
- Tailwind CSS (configure the colour tokens in `tailwind.config` as named tokens)
- `framer-motion` for message entry and view transitions — subtle only
- Hand-authored inline SVG for all Teams glyphs. Do not use an icon library that looks
  obviously different from Fluent; match the screenshots.
- No component library. React context + `useReducer` for state.
- Deploy: Cloudflare Pages / Vercel / Netlify. Custom domain likely `nyn.chat`.

---

## 4. Visual fidelity — the most important section

**Reference screenshots are attached. They are the source of truth, not this document.**
Eyedrop the actual hex values out of them rather than trusting my table below — my values
are approximations read by eye and several are probably a few shades off. Where this
document and a screenshot disagree, the screenshot wins, and tell me so I can fix the doc.

### 4.1 Overall window

Dark, near-black surfaces. The whole app sits inside a browser tab but should read as a
desktop app window. There is a thin darker strip at the very top of the viewport (the macOS
window chrome in the screenshots) — reproduce it as a ~28px black bar with a tiny coloured
status dot on the right. It sells the "this is a desktop app" illusion immediately.

### 4.2 Top bar (~55px, spans full width)

Left to right:
- Sidebar-toggle icon (two-pane glyph), ~20px, muted
- Back and forward chevrons, forward one dimmed/disabled
- **Centred search pill**: rounded rect, ~1050px wide, slightly lighter than the bar,
  magnifier icon + placeholder text `Search (⌘ E)` in muted grey
- Right side: a solid purple **`Update ···`** button (this is a real Teams nag — keep it,
  it's free authenticity and a good place for a gag), then the tenant name
  `Betterworld Techn…` truncated, then a 32px circular avatar with a green presence tick

The bar has a subtle purple tint distinguishing it from the panels below.

### 4.3 Left sidebar (~520px in the screenshots at 2x, i.e. ~260px CSS)

**The vertical app rail is collapsed — do not build one.** The sidebar is the unified
chat list:

1. **Header row:** `Chat` in large bold (~22px), right-aligned icons: `···`, search,
   compose (pencil-in-square) with a chevron
2. **Filter pill row:** `Unread` `Channels` `Chats` — outlined rounded pills, plus a
   chevron at the far right to expand more filters. These should actually filter.
3. **`Copilot`** — a single item with the Copilot glyph
4. **`Quick views`** — collapsible section header with a chevron. Children: `Mentions` (@),
   `Tag mentions` (tag), `Discover` (compass), `Drafts` (pencil-on-lines)
5. Horizontal divider
6. **`Favourites`** — collapsible. Children in the screenshots: `Anoop Sethumadhavan (You)`,
   `PayZapp Design Studio`. Ours will be his own name + `PayZapp Studio`.
7. **`Chats`** — collapsible. The long list of people and groups.
8. Pinned to the bottom: **`Teams and channels`** in bold, always visible

**Row anatomy:** ~50px tall. 32px avatar with a presence badge at bottom-right. **Name only
— no message preview and no timestamp** in this list (confirmed in every screenshot).
Selected row = a lighter grey rounded rectangle inset with a few px of horizontal margin.
Hover reveals a `···` at the right edge. Unread rows use a bolder, brighter name.

**Avatars:** circular photo for people; initials tile for people without one (`RR` on
muted pink, `VM` on muted green, `BS` on muted yellow — desaturated pastel backgrounds with
darker text); **rounded-square** tile for teams/channels (`UF` on red). Presence badge is a
~10px circle with a dark ring, bottom-right: green tick = available, yellow clock = away,
grey/dark = offline, red = busy, purple arrow = OOO.

### 4.4 Conversation header (~60px)

Avatar (~40px), chat name in large bold, a small pencil (rename) icon, then the tab strip:
**`Chat` `Shared` `Notes` `Recap` `+`**. The active tab has a purple underline bar.

Right side, right-aligned:
- Group chats: `Meet now` (video-camera icon + label) with a chevron, then a people icon
  with a member count, then search, then a right-panel toggle, then `···`
- 1:1 chats: a phone icon with a chevron, then add-person icon, then search, panel toggle, `···`

### 4.5 Pinned-message bar (optional, below the header)

Pin icon, sender name, the pinned message content on one line, date right-aligned, `···`.
Thin, full width, slightly inset. Worth building — one great pinned line per chat is high
comedy per unit of effort.

### 4.6 Message list

**Date separators:** plain muted text, horizontally centred, no rule — `4 August`,
`Thursday`, `Yesterday`.

**"Last read" divider:** a horizontal line broken by centred text `Last read` in the accent
purple. Use this once, positioned so the first thing he scrolls into is meaningful.

**Incoming messages:** sender name + timestamp in muted grey on a line above the group, left
aligned and indented to the bubble. 32px avatar at far left, aligned to the first bubble of
the group only. Bubble is a slightly-lighter dark grey, generous padding (~14px 18px),
border-radius ~6px, and it hugs its content — **bubbles are not full width**. Consecutive
messages from the same sender stack as separate bubbles with a small gap, sharing one
avatar and one name/timestamp header.

**Outgoing messages (from Narayan):** right aligned, muted indigo/navy bubble, timestamp
right-aligned above the group, no avatar. A small circle delivery/read indicator floats
just outside the bubble's bottom-right corner.

**Inline formatting inside bubbles:**
- @mentions render in a warm orange/salmon, bold-ish, no background
- Links render in the accent purple-blue, underlined
- Bulleted lists render with real bullets and indentation
- A small `@` glyph appears in the gutter to the right of any message that mentions him

**Reactions:** a pill row hanging just below the bubble's bottom-left, overlapping it
slightly. Each reaction is a circular chip with the emoji; next to them a circular
"add reaction" chip with a smiley-plus glyph. On hover, a floating reaction bar appears
above the bubble's top-right: 👍 ❤️ 😂 😮 😢 😡 then `···`. Clicking attaches a reaction
that persists.

**Quoted reply:** a block at the top of the bubble with a vertical bar on its left, sender
name + timestamp in muted text, the quoted line beneath, then the new message below it.

### 4.7 Rich content blocks inside messages

Build each of these as a component driven by the data schema (§5):

- **Image:** rounded rectangle, max-width ~360px, click opens the lightbox (§4.9)
- **Video:** rounded thumbnail with a large translucent circular play button centred; click
  plays inline
- **File card:** app icon (PowerPoint/Word/Excel/PDF), filename truncated with ellipsis, a
  breadcrumb path line beneath in muted grey (e.g. `ZetaOrg > Zeta Hacks Presents…`), a
  share icon and `···` right-aligned, then a large preview thumbnail below, all inside a
  bordered card. Use this for gag filenames.
- **Link preview card:** thumbnail on the left, title, two-line truncated description,
  domain in muted grey at the bottom. Bordered card.
- **Adaptive-card style block:** for anything custom (e.g. a fake "Farewell Approved"
  workflow card).

### 4.8 Compose area

- **Notice bar** directly above the compose box when present: purple-tinted background,
  message text, dismiss `×` at the right. Real examples from the screenshots:
  `Status of Punith Kumar G: OOO: 31st Aug, 2026` and
  `Jaideep K is out of office and may not respond`. Ours will be jokes.
- **Compose box:** bordered rounded rectangle, placeholder `Type a message`. Right-aligned
  icon row inside the box: format (pen/`Aa`), emoji, attach (paperclip), a loop/Copilot
  glyph, `+`, then a divider, then the send arrow. Enter sends, Shift+Enter newlines.
  Send arrow only becomes active when there is text.

### 4.9 Image lightbox

Full-screen dark scrim over a blurred/dimmed app. Top bar: back arrow, then the sender's
name in bold with the filename, a `|`, the timestamp, a `|`, and a `Show message` link that
jumps back to the message. Right-aligned: zoom out, zoom in, a divider, download. Image
centred with generous margins.

### 4.10 Empty states

Teams-style: a large soft illustration, then a bold sentence beneath it, both centred in the
pane (e.g. `When you select a tag mention, it'll show up here`). Write our own copy for
these — they are cheap, high-yield joke real estate.

### 4.11 Colour tokens (dark) — approximations, verify against screenshots

| Token | Approx | Use |
|---|---|---|
| `--window-chrome` | `#0A0A0A` | Top macOS strip |
| `--topbar` | `#2A2833` | Top bar, faint purple tint |
| `--search-pill` | `#3A3745` | Search field |
| `--surface` | `#1F1F1F` | Sidebar and conversation panes |
| `--row-selected` | `#333338` | Selected chat row |
| `--row-hover` | `#2A2A2A` | Row hover |
| `--bubble-in` | `#2E2E2E` | Incoming bubble |
| `--bubble-out` | `#3B3D63` | Outgoing bubble (muted indigo) |
| `--card` | `#2A2A2A` | File / link preview cards |
| `--divider` | `#3B3B3B` | Hairlines |
| `--text-primary` | `#EDEDED` | |
| `--text-secondary` | `#ADADAD` | Timestamps, names above bubbles, previews |
| `--accent` | `#7F85F5` | Links, active tab underline, "Last read" |
| `--brand-btn` | `#5B5FC7` | `Update` button, send arrow active |
| `--mention` | `#E8956B` | @mention text (warm orange) |
| `--notice-bg` | `#3A2F52` | OOO / status notice bar |
| `--presence-available` | `#6BB700` | |
| `--presence-away` | `#F8D22A` | |
| `--presence-busy` | `#C4314B` | |
| `--presence-ooo` | `#B4A0FF` | |
| `--badge` | `#C4314B` | Unread count |

### 4.12 Typography

- Stack: `'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, 'Helvetica Neue', sans-serif`
- Panel title (`Chat`): 22px / 600
- Chat name in header: 20px / 600
- Sidebar row name: 15px / 400 (600 when unread)
- Message body: 15px / 400, line-height ~22px
- Sender name + timestamp above bubbles: 13px / 400, secondary
- Section headers (`Quick views`, `Favourites`, `Chats`): 14px / 400, secondary
- Do not use a rounded or friendly typeface. The corporate neutrality is what sells the joke.

---

## 5. Data model

Create `/src/data/` with the schema below. Ship 2–3 complete dummy people so the app runs;
I will replace the files wholesale.

`people.json`:

```jsonc
[
  {
    "id": "aditya-sadhukhan",                // slug, also the URL hash
    "name": "Aditya Sadhukhan",
    "title": "Design Lead — PayZapp Studio", // shown in the profile card popover
    "avatar": "/media/avatars/aditya.jpg",   // omit to fall back to an initials tile
    "initialsColor": "pink",                 // pink | green | yellow | blue | red | purple
    "kind": "person",                        // person | group  (group = rounded-square tile)
    "presence": "available",                 // available | away | busy | offline | ooo
    "section": "chats",                      // favourites | chats
    "order": 3,
    "unread": true,
    "pinnedMessage": {                       // optional, renders the bar in §4.5
      "author": "Narayan Sundaram",
      "text": "Let's take this offline.",
      "date": "18/07/25"
    },
    "notice": "Narayan is out of office and may not respond",  // optional, §4.8 bar
    "thread": [ /* Node[] */ ]
  }
]
```

Thread nodes:

```jsonc
// A message
{
  "type": "message",
  "from": "them",                          // "them" | "nyn"
  "time": "11:19 am",
  "blocks": [
    { "kind": "text", "value": "Boss, three years and not one **PJ** I could unhear." },
    { "kind": "text", "value": "Hi @Narayan, thanks for everything -" },   // @Name → mention style
    { "kind": "list", "items": ["solution walkthrough", "Prototype/demo"] },
    { "kind": "image", "src": "/media/aditya/offsite.jpg" },
    { "kind": "video", "src": "/media/videos/aditya.mp4", "poster": "/media/aditya/poster.jpg" },
    { "kind": "file",  "name": "Narayan_Farewell_FINAL_v9_REALLY_FINAL.pptx",
      "app": "powerpoint", "path": "ZetaOrg > PayZapp Studio > Do Not Open",
      "preview": "/media/aditya/deck-preview.png" },
    { "kind": "link",  "url": "https://nyn.me", "title": "nyn.me",
      "description": "...", "thumbnail": "/media/link-nyn.png" },
    { "kind": "quote", "author": "Narayan Sundaram", "time": "29/08/26 11:10 am",
      "value": "I'm sitting in the PZ bay upstairs" }
  ],
  "reactions": ["❤️"],
  "mentionsNyn": true                        // renders the @ glyph in the right gutter
}

// A gate: everything after stays hidden until he replies
{ "type": "unlock", "suggestions": ["Thank you 🙏", "I don't remember this at all", "Who approved this"] }

// Centred date separator
{ "type": "date", "value": "4 August" }

// The "Last read" divider
{ "type": "lastRead" }

// Grey centred system line
{ "type": "system", "value": "Narayan added everyone to this chat — 12 August 2022" }
```

`config.json`: site title, his display name / avatar / title, tenant name, the gate password
if any, presentation-mode defaults, and an `easterEggs` block of on/off switches.

**Media rules:** images in `/public/media/<person>/`, videos in `/public/media/videos/`.
Videos over ~5 MB should be referenced by external URL (Cloudflare R2 / unlisted YouTube)
rather than bundled — support a raw `<video>` src *and* an embed URL. Lazy-load everything
below the fold with explicit dimensions so the layout never jumps.

### 5.1 Video message placeholders

Eight video messages exist and will be uploaded later. Scaffold these people now with a
placeholder video block (a poster frame + play button that shows "Coming soon" on click), so
I can drop the real files in without touching components:

`Pradyoth` · `Maggie` · `Amayranjan Das` · `Uttam` · `Vinay M` · `H Varun` · `Allwyn` ·
`Shubhayu`

Expected paths: `/public/media/videos/<slug>.mp4`, e.g. `/public/media/videos/pradyoth.mp4`.

---

## 6. Screens

**Chat (primary).** Deep-link each conversation to `/#/chat/<person-id>`.

**Shared tab** (per conversation): a grid of every image, video, and file that person shared.
Lightbox on click. Cheap to build from existing data, genuinely nice to browse.

**Recap tab** (per conversation): Teams' AI-recap feature. Render a fake AI summary of the
"conversation" in Copilot's voice — bulleted, confidently wrong, faintly corporate. One of
the best joke surfaces in the whole app; give it a real Copilot-style card treatment with
the sparkle glyph and a "AI-generated content may be incorrect" footnote.

**Notes tab:** a nearly-empty notes surface with one line on it. Keep it minimal.

**Mentions / Tag mentions (Quick views):** a chronological feed of every message that
mentions him, in the screenshot's layout — avatar, chat name, date, then a one-line preview
with the mention in orange. Clicking jumps to the message. This should be the **default
landing view on first load**, so his first click is exploratory rather than being dropped
into one chat.

**Copilot:** its own pane. `Welcome to Copilot Chat` heading, a `Message Copilot` input, and
the suggestion chips `Learn` `Find` `Summarize` `Suggest` `···`. It is a scripted bot — see
§8. This is the highest-value gag in the app; build it properly.

**Discover / Drafts:** empty states with joke copy.

**Teams and channels:** one team, `PayZapp Studio`, with channels `General`, `Random`,
`gff-war-room`, `narayan-farewell-secret-do-not-open`. The last is where the group message
and the team photo dump live. Build only if time allows; it can degrade to the chat layout.

**Search:** the top pill actually works — substring match across all message text, results
in Teams' search-results layout, clicking jumps to and highlights the message. He will
search his own name. Make sure that returns something good.

---

## 7. Interaction model — the scripted thread

On opening a conversation for the first time:

1. Render messages up to the first `unlock` node, but **stagger them**: show a typing
   indicator (three bouncing dots in a bubble, plus `X is typing…`) for 600–1100 ms —
   vary it, scale with message length — then pop the message in with a small fade + rise.
   Sequential, not all at once. This is what makes it feel alive.
2. Stop at the `unlock` node. Show suggested-reply chips above the compose box.
3. When he sends anything — typed or a chip — append it as an outgoing bubble, then resume
   playback after the `unlock`.
4. Persist read/unread state, his sent replies, and his reactions to `localStorage`, keyed
   by a schema version so I can bust it when I edit content. On revisit, seen messages render
   instantly; only new content animates.
5. `Mark all as unread` in the `···` menu, so he can replay the whole thing.
6. Respect `prefers-reduced-motion` — render everything instantly.

---

## 8. Copilot: the scripted bot

`config.json` holds an array of `{ patterns: string[], response: string }`. On send, match
the input against patterns in order, fall through to a default. Stream the response
character by character with the Copilot sparkle animation, exactly like the real thing.

Behaviour, roughly:
- Asked anything about Narayan → an over-confident summary of his tenure, mostly true, one
  detail hilariously wrong, with fake citation chips at the bottom
- Asked for a joke → returns one of his own PJs, then `AI-generated content may be incorrect`
- Asked "who will run PayZapp Studio now" → a long pause, then `Working on it…` forever
- Asked to summarise the farewell → refuses on the grounds that it's "too emotional to
  process"
- Default → deflects and suggests he read his messages instead

I will supply the actual PJs and inside references. Leave the array well-commented and
obvious to edit.

---

## 9. Presentation mode (for the live reveal)

Toggled with `Ctrl/Cmd + Shift + P`, or `?present=1`.

- Scales the whole UI up (root font-size + layout scale) to read from the back of a room
- `→` advances one message; `Space` toggles auto-play of the current thread
- `J` / `K` move to the next/previous chat in the sidebar
- Hides the cursor after 2s idle; no scrollbars; auto-scrolls to keep the newest message
  vertically centred

**Intro overlay on first-ever load:** a fake Teams splash — purple logo, `Signing you in…`,
then the window builds in. Two seconds, skippable by clicking, never shown again. This is
the moment the room realises what it is, so it must land cleanly.

Optional soft gate before it: a Teams-style sign-in screen where the only account listed is
his, and clicking it just proceeds.

---

## 10. Easter eggs — all behind flags in `config.easterEggs`

Real-Teams elements repurposed (these are the good ones, because they're authentic):

- His presence is **Away**, custom status `Out of office — permanently`. Hovering his avatar
  opens the profile card, which links to `nyn.me` and his LinkedIn (`linkedin.com/in/nyn`).
- The OOO notice bar above the compose box, rotating per chat:
  `Narayan is out of office and may not respond`, `Narayan has left the building`,
  `Status of Narayan: OOO: forever`
- The purple **`Update`** button in the top bar: clicking it shows
  `Update unavailable. This version of Narayan is final.`
- **Recap tab** — see §6, the fake AI summary
- **`Meet now`** → a fake pre-join screen with everyone's camera tiles and a `Join now`
  button, which plays the group video (or rickrolls, if we don't get one in time)
- `···` on any message offers **`Unsend`** → `Too late.`
- The `+` tab in the header adds a tab called `Farewell` that can't be closed
- The `Teams and channels` list shows one channel he can't access: `#exit-interview` with a
  lock icon
- Gag file cards with names like `Narayan_Farewell_FINAL_v9_REALLY_FINAL.pptx` and
  `handover-notes.xlsx` (path breadcrumb: `ZetaOrg > PayZapp Studio > Do Not Open`)
- Idle 60s → someone types `you still there?`
- A toast notification every ~45s pulling an unread thread to attention; hard-cap the total
  so it never becomes annoying
- Konami code → every avatar in the sidebar becomes his face

**Content notes for jokes:** he likes PJs (punny "poor jokes") — the humour should lean
groan-worthy on purpose, and at least one chat should be entirely people retaliating with
their own bad puns. I'll supply the specific inside references, the real PJs, and the
mention-worthy incidents. Ask me rather than inventing Zeta-specific details.

---

## 11. Non-goals

Do not build: authentication, a CMS or admin UI, message editing, a service worker/PWA,
analytics, i18n, or any Microsoft account integration. Do not add a "made with" footer.
**Do not use Microsoft's actual logo files or wordmark** — recreate the visual language with
our own SVGs, and where a product name would appear, use Zeta / PayZapp Studio /
Betterworld Technologies branding instead.

---

## 12. Build order

1. **Shell.** Top bar, sidebar, conversation pane, dark tokens, typography. Get proportions
   right against the screenshots before anything else. Show me this first.
2. **Data layer.** Types, JSON loading, dummy content for 3 people.
3. **Sidebar.** Sections, filter pills, rows, avatars, presence, selection, unread.
4. **Conversation pane.** Header + tabs, date separators, message groups, bubbles, all
   block types from §4.7.
5. **Scripted playback.** Typing indicators, unlock gates, suggested replies, localStorage.
6. **Reactions, hover bar, compose box, notice bar, lightbox, Shared tab.**
7. **Mentions feed + working search.**
8. **Copilot bot + Recap tab.**
9. **Presentation mode + intro overlay.**
10. **Easter eggs.**
11. **Mobile layout** (list and conversation as stacked views with a back button, like Teams
    mobile), performance pass, deploy config.

Stop after each milestone and show me the result before continuing.

---

## 13. Ask me about

The final list of people and their order; real avatars; the exact wording of any joke or PJ;
video files and hosting URLs; the gate password; and whether a particular Teams behaviour is
worth the complexity. Do not invent Zeta-internal details.
