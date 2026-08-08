#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


DEFAULT_PROMPT = """Use case: polished 2D mobile game character cut-in for a portrait mahjong roguelike operation animation.
Create an elegant restrained guofeng Chinese female mahjong court lady / board-game host. She wears layered jade green, ivory, and muted gold traditional robes. She holds an ivory folding fan in one hand and a single mahjong tile in the other. Her expression is calm, confident, refined, and not seductive. Three-quarter body, facing slightly left, as if entering from the right side of a mobile game screen.
Style: premium Chinese board-game illustration, clean UI-ready silhouette, delicate linework, soft painterly lighting, restrained luxury.
Composition: vertical portrait cut-in, full visible figure from head to lower robe, generous padding, transparent background if supported; otherwise use a plain clean pale ivory background for easy local cutout.
Constraints: no text, no logo, no watermark, no decorative frame, no table, no casino or gambling cues.
Avoid: revealing outfit, seductive pose, school uniform, modern fashion, cluttered background, extra hands, malformed fingers, heavy anime exaggeration, dense props."""


def request_json(
    method: str,
    url: str,
    token: str,
    body: dict[str, Any] | None = None,
    *,
    use_curl: bool = False,
) -> dict[str, Any]:
    if use_curl:
        return request_json_curl(method, url, token, body)

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    data = None if body is None else json.dumps(body, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {error.code}: {detail}") from error


def request_json_curl(method: str, url: str, token: str, body: dict[str, Any] | None = None) -> dict[str, Any]:
    command = [
        "curl",
        "--silent",
        "--show-error",
        "--request",
        method,
        "--url",
        url,
        "--header",
        f"Authorization: Bearer {token}",
        "--header",
        "Content-Type: application/json",
        "--write-out",
        "\n%{http_code}",
    ]
    if body is not None:
        command.extend(["--data", json.dumps(body, ensure_ascii=False)])

    result = subprocess.run(command, check=False, text=True, capture_output=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"curl exited {result.returncode}")
    response, _, status_text = result.stdout.rpartition("\n")
    status = int(status_text.strip() or 0)
    if status < 200 or status >= 300:
        raise RuntimeError(f"HTTP {status}: {response}")
    return json.loads(response)


def extract_task_id(response: dict[str, Any]) -> str:
    data = response.get("data") or response
    task_id = data.get("id") or data.get("task_id") or data.get("task")
    if not isinstance(task_id, str) or not task_id:
        raise RuntimeError(f"No task id in response: {json.dumps(response, ensure_ascii=False)}")
    return task_id


def extract_image_url(response: dict[str, Any]) -> str:
    data = response.get("data") or response
    result = data.get("result") or {}
    images = result.get("images") or []
    if not images:
        raise RuntimeError(f"Completed response has no images: {json.dumps(response, ensure_ascii=False)}")
    url = images[0].get("url")
    if isinstance(url, list):
        url = url[0] if url else None
    if not isinstance(url, str) or not url:
        raise RuntimeError(f"Completed response has no image URL: {json.dumps(response, ensure_ascii=False)}")
    return url


def download(url: str, path: Path) -> None:
    with urllib.request.urlopen(url, timeout=120) as response:
        path.write_bytes(response.read())


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate one APIMART image task and download the result.")
    parser.add_argument("--out", default="output/imagegen/hulebu-east-court-lady-cutin-apimart-v1.png")
    parser.add_argument("--meta-dir", default="output/imagegen")
    parser.add_argument("--model", default="gemini-3-pro-image-preview")
    parser.add_argument("--size", default="9:16")
    parser.add_argument("--resolution", default="1K")
    parser.add_argument("--prompt", default=DEFAULT_PROMPT)
    parser.add_argument("--poll-interval", type=int, default=5)
    parser.add_argument("--max-wait", type=int, default=600)
    parser.add_argument("--transport", choices=["urllib", "curl"], default="curl")
    args = parser.parse_args()

    token = os.environ.get("APIMART_API_KEY")
    if not token:
        raise SystemExit("APIMART_API_KEY is not set")

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    meta_dir = Path(args.meta_dir)
    meta_dir.mkdir(parents=True, exist_ok=True)

    payload = {
        "model": args.model,
        "prompt": args.prompt,
        "size": args.size,
        "n": 1,
        "resolution": args.resolution,
    }

    create_response = request_json(
        "POST",
        "https://api.apimart.ai/v1/images/generations",
        token,
        payload,
        use_curl=args.transport == "curl",
    )
    (meta_dir / "apimart-hulebu-east-court-lady-create.json").write_text(
        json.dumps(create_response, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    task_id = extract_task_id(create_response)
    print(f"APIMART task: {task_id}")

    deadline = time.monotonic() + args.max_wait
    poll_index = 0
    while time.monotonic() < deadline:
        time.sleep(args.poll_interval)
        poll_index += 1
        poll_response = request_json(
            "GET",
            f"https://api.apimart.ai/v1/tasks/{task_id}?language=zh",
            token,
            use_curl=args.transport == "curl",
        )
        (meta_dir / "apimart-hulebu-east-court-lady-poll.json").write_text(
            json.dumps(poll_response, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        data = poll_response.get("data") or poll_response
        status = str(data.get("status") or "")
        progress = data.get("progress")
        print(f"poll {poll_index}: {status} {progress}%")
        if status in {"completed", "succeeded", "success"}:
            image_url = extract_image_url(poll_response)
            download(image_url, out_path)
            print(f"WROTE {out_path}")
            return 0
        if status in {"failed", "error", "canceled", "cancelled"}:
            raise SystemExit(json.dumps(poll_response, ensure_ascii=False, indent=2))

    raise SystemExit(f"Timed out waiting for task {task_id}")


if __name__ == "__main__":
    raise SystemExit(main())
