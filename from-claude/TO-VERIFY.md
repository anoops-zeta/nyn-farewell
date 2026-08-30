# What's left — needs facts only you have

Everything mechanical is fixed. These need you.

---

## 1. The PJ slots — 8 of them

Search the files for `<<PJ` and you'll find every slot. They're written so the site still
renders if you miss one, but they must be filled before the reveal.

| Where | Slot |
|---|---|
| `nyn-thread.json`, April 2024 | the flat-tyre one, verbatim |
| `nyn-thread.json`, 11:47 am | the one he'd actually open the farewell with |
| `nyn-thread.json`, 9:14 pm | the last one |
| `config.json`, copilot rule 1 | his worst one |
| `pj-support-group.draft.json` | PJ 1 (also the pinned message), PJ 2, PJ 3, PJ 4 |

**The test:** if it makes you feel something, it isn't a PJ. It should make you groan.
Per Maggie's transcript, his land late — a good one should take four seconds.

Ask Arup, Manivel and Maggie. All three named the PJs unprompted, so all three have
specific ones in mind.

---

## 2. Personal facts in the self-chat — confirm or delete

I kept the ones corroborated elsewhere in your own data and **cut the rest**. Cut because
nothing in the material you gave me supports them, and being confidently told what you're
into by a fake version of yourself is a bad feeling:

- Triumph motorcycle · farming plot · ADAS tinkering · Meta glasses · Surface-not-Mac
- 5am gym · the Malayalee-in-Bengaluru paragraph
- "10M celebration was huge… a day worth remembering"
- The old pinned message: "10 million users. Built the studio. Handed it over properly."
  (that's a LinkedIn headline; nobody pins that to themselves)

**Kept**, because your own data supports them: the turf and leg day (his messages in
`football-ec` and `payzapp-studio`), karaoke and Malare (the studio thread has him
half-agreeing to sing at the next offsite), CC Lego / Cipher / Synapse (Pradyoth's
message), nyn.me.

If any of the cut items are actually true, put them back — but as fragments, not sentences.

**Also deleted outright:** the August 2026 message that read "Read through the farewell
messages tonight. Shivangi — tech wiz. Uttam — Rancho of 3 Idiots. Maggie — the one-liners."
He hasn't read them yet. That line spoiled three of the best moments on the site.

---

## 3. `pj-support-group.draft.json` — pulled out of `people.json`

It was rendering raw TODO text on the live site, so I removed it from `people.json`
entirely. It now has a proper shape: Arup starts the chat, three PJs land, people suffer,
and then someone adds Narayan and nobody admits to it.

**To ship it:** fill the `<<PJ>>` slots and every `"sender": "TODO"`, then paste the object
back into the `people.json` array. **To cut it:** do nothing. It can't render from where it is.

---

## 4. Copilot — one more thing to write

`config.json` → `copilot.rules[3]` needs one confidently wrong detail about him. An award he
never won, a language he doesn't speak, a sport he's bad at. It should be plausible for
about a second.

---

## 5. Titles

Every `"title"` that read `TODO` is now `null`. Make the profile card hide the line when the
title is null, then fill in real ones when you have them.

---

## What I changed without asking

- **`config.siteTitle`** → `Chat | Zeta Teams`. It said "Narayan Babu — Farewell", which
  showed in the browser tab before the splash finished and spoiled the reveal.
  Description → "You have 23 unread messages."
- **`payzapp-studio` date order** — 8 January 2026 was sitting between two October 2025
  blocks. Moved.
- **`payzapp-studio` notice** → the real Teams OOO string, replacing "10M users, three years
  of photos — this thread's the scrapbook," which explained the joke.
- **`thursday-club`** pinned bar removed (it was raw TODO text).
- **Sidebar order.** Pradyoth was at 2; his message is one of the two strongest on the site,
  so he's now 22, next to Manoj, with Arup still closing. Uttam moved to 20 — "I'll think of
  you every time I open PayZapp. Just kidding, I'll think of you anyway" is a closing-stretch
  line. The opening is now Shivangi → studio photos → Naveen → Thursday Club, which stays
  light while he's still working out what he's looking at.

## What I deliberately left alone

The admin messages in the studio thread — "Hi @Everyone, FYI pls – Request you to block your
calendars. Thank you" — are the best writing on the site. That deadpan does more than any
joke. Same with the Drafts empty state. Don't polish either.
