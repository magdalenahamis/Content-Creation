# Project Context & Current Status

## What This Repo Is

This is a **ButterCut** video editing workflow repo used to cut and edit **financial advice videos for Instagram**. The main library is `finance-reels`.

## What ButterCut Does

ButterCut is a Ruby/Python CLI toolkit that automates a 3-step video editing pipeline:

1. **`/transcribe-audio`** — runs WhisperX on raw video → creates a JSON audio transcript with word-level timing
2. **`/analyze-video`** — extracts video frames + combines with transcript → creates a visual transcript
3. **`/roughcut`** — uses the visual transcript to generate a rough cut YAML and export to XML for video editing

## Current State

### Library
- Library name: `finance-reels`
- Location: `libraries/finance-reels/`
- `library.yaml` fully set up: language English, editor fcpx
- One video registered

### Raw Video
- `raw videos/03DAAF0C-4E2D-40AA-BFE5-E1638D132E64.mp4` (44 seconds, vertical 1080x1920, 30fps)

### What Has Been Done
- ✅ WhisperX installed in WSL at `~/.buttercut/venv`
- ✅ Audio transcript: `libraries/finance-reels/transcripts/03DAAF0C-4E2D-40AA-BFE5-E1638D132E64.json`
- ✅ Visual transcript: `libraries/finance-reels/transcripts/visual_03DAAF0C-4E2D-40AA-BFE5-E1638D132E64.json`
- ✅ **Final MP4:** `libraries/finance-reels/roughcuts/roughcut_20260315_v2_final3.mp4`
- ✅ Latest YAML: `libraries/finance-reels/roughcuts/roughcut_20260315_v2_final_20260315_051508.yaml`
- ✅ Latest FCPXML: `libraries/finance-reels/roughcuts/roughcut_20260315_v2_final_20260315_051508.fcpxml`
- ✅ Backup: `backups/libraries_20260315_051720.zip`
- ✅ Remotion source repo cloned at `C:/Content-Creation/remotion/` (separate git repo, not tracked here)
- ✅ `add-animations` skill created at `.agents/skills/add-animations/`
- ✅ Remotion project scaffolded at `C:/Content-Creation/remotion-project/`
- ⚠️ First animated render produced: `libraries/finance-reels/roughcuts/7_things_animated.mp4` — **video renders as still image** (OffthreadVideo issue to fix), animations fire correctly but need design improvement
- ⚠️ Also produced: `libraries/finance-reels/roughcuts/7_things_20s_v1.mp4` (clean roughcut used as animation input)

### Status
**`roughcut_20260315_v2_final3.mp4` is the current best final cut.**

**Remotion animation workflow is in progress — not yet satisfactory.** Known issues:
1. The base video renders as a still image instead of playing — `OffthreadVideo` not working correctly in this setup
2. Animation design (kinetic captions, section titles, stat callouts, CTA) needs visual improvement once the video issue is fixed
3. Next step: fix the OffthreadVideo rendering issue, then iterate on animation style with Magda

## Video Content

**Title:** "7 Things to Never Spend Money On in Your 20s"

**What was actually filmed (differs from written script):**
- "Capital One café for $2. Easy fix." — NOT in recording
- CTA ending: video says "follow for more money content" (not "we're on this together")
- Tip 1 ends on "at least you'll learn" — "something" cut to avoid source footage stutter

**Script (user's written version):**
> Seven things to never spend your money on in your 20s if you don't want to go broke in your 30s.
> One — gambling. Specifically sports betting. If you're going to gamble, just day trade. At least you learn something.
> Two — expensive pets. Dogs and cats are way more expensive than people think. They're literally like kids. If you don't have the time or money, skip it.
> Three — eating out every day. It adds up faster than you think.
> Four — daily coffee runs. Make it at home for 25 cents, or hit a Capital One café for $2. Easy fix.
> Five — a brand new car. It loses half its value in the first few years. Get a beater and invest the difference.
> Six — designer clothes. Gucci, Louis Vuitton — none of it is worth it in your 20s.
> Seven — speeding tickets. I paid almost $400 for one. I drive like a grandma now.
> Look, I don't hate spending money. I just hate spending it on things that don't make sense.
> If you think I missed something, drop it in the comments — we're on this together.

## Final Cut Segments (v2_final3)

| Clip | In | Out | Content |
|------|-----|-----|---------|
| 1 | 0.031 | 8.62 | Hook + tip 1 (ends on "at least you'll learn") |
| 2 | 9.18 | 16.210 | "Two —" + expensive pets |
| 3 | 16.65 | 19.333 | "Three —" + eating out |
| 4 | 19.34 | 22.617 | "Four —" + coffee runs |
| 5 | 22.63 | 27.904 | "Five —" + brand new car |
| 6 | 28.23 | 31.768 | "Six —" + designer clothes |
| 7 | 31.78 | 43.823 | "Seven —" + speeding + outro |

To re-render from these segments:
```bash
wsl -e bash -c "ffmpeg -f concat -safe 0 -i /tmp/segments_v2_final3.txt -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 128k 'libraries/finance-reels/roughcuts/roughcut_YYYYMMDD_vN.mp4' -y"
```
Segments file: `/tmp/segments_v2_final3.txt` (WSL, ephemeral — recreate from table above if needed)

## Roughcut Skill — Lessons Learned

These lessons are now baked into `.claude/skills/roughcut/agent_instructions.md`:

### 1. Doubled words at edit points
After assembling clips, compare the last word of clip N with the first word of clip N+1. If they match, trim clip N's `out_point` back to just before that word starts using the word-level `words` timing array.

### 2. Include section number announcements
Number words like "Two —", "Three —" live in the silence gap *before* the content word. They appear as number-only segments in the transcript (e.g. `"text": "2."`) with no word-level timing. Always set each clip's `in_point` ~0.05s before the number segment's `start`, not at the first content word.

### 3. Never share a timestamp between consecutive clips
Always leave a small gap (even 0.01s) between `out_point` of clip N and `in_point` of clip N+1. Identical timestamps risk AAC audio frame duplication = audible stutter.

### 4. Source footage stutters
If a doubled word persists after the edit-point check, the speaker repeated the word in the source itself. Fix: trim the clip's `out_point` to end just before the stutter using word-level timing.

## Environment

- OS: Windows 11 Pro
- Shell: WSL2 Ubuntu 22.04 (use `wsl -e bash -c "..."` for all CLI commands)
- Python: 3.12.3 in WSL, venv at `~/.buttercut/venv`
- Ruby: 3.2.3 in WSL
- FFmpeg: 6.1.1 in WSL
- WhisperX: 3.8.2 in `~/.buttercut/venv`
- WhisperX wrapper: `~/.buttercut/whisperx` (full path needed in non-interactive shells)

## Key Paths

| What | Path |
|------|------|
| Raw video | `C:/Content-Creation/raw videos/03DAAF0C-4E2D-40AA-BFE5-E1638D132E64.mp4` |
| WSL equivalent | `/mnt/c/Content-Creation/raw videos/03DAAF0C-4E2D-40AA-BFE5-E1638D132E64.mp4` |
| Library | `C:/Content-Creation/libraries/finance-reels/` |
| Audio transcript | `libraries/finance-reels/transcripts/03DAAF0C-4E2D-40AA-BFE5-E1638D132E64.json` |
| Visual transcript | `libraries/finance-reels/transcripts/visual_03DAAF0C-4E2D-40AA-BFE5-E1638D132E64.json` |
| **Current best MP4** | `libraries/finance-reels/roughcuts/roughcut_20260315_v2_final3.mp4` |
| Current FCPXML | `libraries/finance-reels/roughcuts/roughcut_20260315_v2_final_20260315_051508.fcpxml` |
| Skills | `C:/Content-Creation/.claude/skills/` (symlinks to `.agents/skills/`) |
| Remotion source | `C:/Content-Creation/remotion/` (separate git repo) |
| Remotion project | `C:/Content-Creation/remotion-project/` |
| Animation examples | `C:/Content-Creation/animation-examples/` |

## Skills Installed

| Skill | Source | Status |
|-------|--------|--------|
| `transcribe-audio` | ButterCut | ✅ Working |
| `analyze-video` | ButterCut | ✅ Working |
| `roughcut` | ButterCut | ✅ Working |
| `backup-library` | ButterCut | ✅ Working |
| `setup` | ButterCut | ✅ Working |
| `update-buttercut` | ButterCut | ✅ Working |
| `release` | ButterCut | ✅ Working |
| `skill-creator` | Anthropic | ✅ Working |
| `add-animations` | Custom (local) | ⚠️ In progress — video still image bug, design needs work |
