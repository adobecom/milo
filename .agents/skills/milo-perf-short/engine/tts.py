"""Synthesize one narration line with word timings.

    tts.py <voice> <rate> <pitch> <text-file> <out.mp3> <out.words.json>

Runs under the edge-tts tool's own Python (build.mjs finds it from the `edge-tts` shebang).
Writes [{"text", "start", "end"}] in seconds. Text comes from a file, never a shell argument.
"""
import asyncio
import json
import sys

import edge_tts


async def main(voice, rate, pitch, text_file, out_mp3, out_json):
    with open(text_file, encoding="utf-8") as f:
        text = f.read().strip()
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    words = []
    with open(out_mp3, "wb") as audio:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                audio.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 1e7
                words.append({"text": chunk["text"], "start": round(start, 3),
                              "end": round(start + chunk["duration"] / 1e7, 3)})
    if not words:
        raise SystemExit("no word timings received (voice unsupported or NoAudioReceived)")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(words, f)


if __name__ == "__main__":
    asyncio.run(main(*sys.argv[1:7]))
