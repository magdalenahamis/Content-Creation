# Roughcut Agent Instructions

You are a video editor AI agent. Analyze footage, make editorial decisions based on user requests, and produce a YAML timing based rough cut.

## Workflow

### 1. Gather Preferences (if needed)

- **Only ask questions if the user's initial request is vague or lacks critical details**
- If the user has already provided clear instructions about structure, duration and pacing, skip questions and proceed directly to step 2
- If clarification is needed, use AskUserQuestion tool to ask about whatever is missing, ie:
  - Narrative structure preference
  - Target duration
  - Pacing preference

### 2. Create Combined Visual Transcript

Combine all visual transcripts into a single file:

```bash
mkdir -p tmp/[library-name] && cat libraries/[library-name]/transcripts/visual_*.json > tmp/[library-name]/[roughcut_name]_combined_visual_transcript.json
```

This outputs to `tmp/[library-name]/[roughcut_name]_combined_visual_transcript.json` in NDJSON format (one JSON object per line per video):
```json
{
  "language": "en",
  "video_path": "/full/path/to/video.mov",
  "segments": [
    {"start": 2.917, "end": 7.586, "text": "Hey, good afternoon.", "visual": "Man speaking to camera outdoors."},
    {"start": 8.307, "end": 10.551, "text": "Today is going to be different."},
    {"start": 10.551, "end": 15.0, "text": "", "visual": "Walking shot, buildings in background.", "b_roll": true}
  ]
}
```

**Segment fields:**
- `start`, `end`: Timestamps in seconds
- `text`: Dialogue (empty string `""` for silent segments)
- `visual`: Shot description (only present when visual changes)
- `b_roll`: `true` when segment is silent B-roll (only present when true)

### 3. Read and Analyze Combined Transcript

**Count lines and plan reading:**
```bash
wc -l tmp/[library-name]/[roughcut_name]_combined_visual_transcript.json
```

**Read the combined transcript in 5000-line chunks** using the Read tool with offset and limit parameters.

After reading through footage sequentially, you can spend a little time thinking, and then create the roughcut yaml file.

### 4. Create Rough Cut YAML

**Generate a timestamp** using `date +%Y%m%d_%H%M%S` and use the resulting value as a literal string in all filenames for this roughcut session (YAML and XML).

**Setup:**
```bash
cp templates/roughcut_template.yaml "libraries/[library-name]/roughcuts/[roughcut_name]_[timestamp].yaml"
```

**Build clips based on user's request:**
- Use the user's stated goals to guide editorial decisions
- Convert timestamps from seconds to `HH:MM:SS.ss` format (hundredths of second precision)
- Reference video files using `source_file` from the combined JSON

**CRITICAL - Timecode Logic:**
- `in_point`: Start time of FIRST segment you want
- `out_point`: End time of LAST segment you want
- Use `start` and `end` from segments directly (preserve sub-second precision)
- Example: segment at 2.849s-29.63s → in_point: `00:00:02.85`, out_point: `00:00:29.63`

**CRITICAL - Include section number announcements:**
Many talking-head videos announce section numbers ("Two —", "Three —", etc.) in the brief silence *before* the content word of that section. These announcements have no word-level timing in the transcript — they appear as number-only segments (e.g. `"text": "2."`) with no `words` timing data, sitting in the gap between the previous clip's last word and the next content word.

Always set each clip's `in_point` to just *before* the number announcement segment's `start` time (add ~0.05s lead-in), NOT at the first content word. Otherwise the number word gets dropped entirely.

**Example:** Transcript shows "something." ends at 8.981, then a "2." segment at 9.222 (no word timing), then "Expensive" starts at 9.362. The correct `in_point` for clip 2 is ~9.18 (before "Two" is spoken), not 9.362.

**CRITICAL - Never share a timestamp between consecutive clips:**
Always leave a small gap between `out_point` of clip N and `in_point` of clip N+1 (even 0.01s is enough). Setting them to the exact same value risks AAC audio frame duplication at the cut point, which sounds like a brief stutter or doubled word.

**CRITICAL - Required Fields:**
Each clip needs:
- `dialogue`: Spoken words from transcript (or `""` if silent B-roll)
- `visual_description`: Shot description from visual transcript

**Metadata:**
- `created_date`: `YYYY-MM-DD HH:MM:SS`
- `total_duration`: Sum of all clips in `HH:MM:SS.ss` format

### 5. Check and Fix Doubled Words at Edit Points

After assembling all clips, scan each consecutive pair for doubled words — where the last spoken word of clip N is the same word as the first spoken word of clip N+1. This happens because transcript segments often share a word at their boundary, so both clips end up including it.

**For each consecutive pair of clips:**

1. Extract the last word from clip N's `dialogue` (lowercase, strip punctuation)
2. Extract the first word from clip N+1's `dialogue` (lowercase, strip punctuation)
3. If they match → doubled word detected

**To fix:** Look up that word in the audio transcript's `words` array to get its exact `start` timestamp. Set the `out_point` of clip N to just before that word starts (subtract ~0.02s as a small buffer). Also remove that word from the end of clip N's `dialogue` field so the text matches the new cut.

**Example:**
- Clip 3 ends: `"...adds up faster than you think."` at `out_point: 00:00:19.35`
- Clip 4 starts: `"think. Four — daily coffee runs..."`
- → "think" is doubled. Find "think" in the words array → `start: 19.31`. Set clip 3 `out_point: 00:00:19.29`. Remove "think." from end of clip 3 dialogue.

**After fixing, recalculate `total_duration`** to reflect any trimmed out_points.

**Source footage stutters — doubled words not at edit points:**
Sometimes the speaker themselves repeats a word in the source footage (a natural stumble). WhisperX may or may not catch this — it can silently collapse two instances into one timestamp. If a doubled word persists after the edit-point check above, the repetition is in the source audio within a single clip. Fix: trim that clip's `out_point` to end just *before* the repeated word starts (i.e. end on the last clean word before the stutter), using the word-level `words` timing to find the exact cut point.

### 6. Export to Video Editor

Check `library.yaml` for the `editor` field. If it's set, use that value. If it's not set or empty, check `libraries/settings.yaml` for the default `editor` value and use that (also save it back to `library.yaml`). If neither has an editor set, ask the user for their editor choice (Final Cut Pro X, Adobe Premiere Pro, or DaVinci Resolve), then save their choice back to both `library.yaml` and `libraries/settings.yaml`.

Export based on choice:
```bash
# Final Cut Pro X:
bundle exec ./.claude/skills/roughcut/export_to_fcpxml.rb libraries/[library-name]/roughcuts/[roughcut_name]_[datetime].yaml libraries/[library-name]/roughcuts/[roughcut_name]_[datetime].fcpxml fcpx

# Premiere Pro:
bundle exec ./.claude/skills/roughcut/export_to_fcpxml.rb libraries/[library-name]/roughcuts/[roughcut_name]_[datetime].yaml libraries/[library-name]/roughcuts/[roughcut_name]_[datetime].xml premiere

# DaVinci Resolve:
bundle exec ./.claude/skills/roughcut/export_to_fcpxml.rb libraries/[library-name]/roughcuts/[roughcut_name]_[datetime].yaml libraries/[library-name]/roughcuts/[roughcut_name]_[datetime].xml resolve
```

### 7. Create Backup

Run the `backup-library` skill to preserve the completed work.

### 8. Report Results

Provide summary with:
- Rough cut name and duration
- Number of clips included
- File path for XML
- Backup confirmation
