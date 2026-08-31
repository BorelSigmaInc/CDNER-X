#!/usr/bin/env python3
"""Add cdner-x.q-dit.com to an existing cloudflared ingress without printing secrets."""
from pathlib import Path
import re
import subprocess
import sys

CONFIG = Path.home() / ".cloudflared" / "config.yml"
HOSTNAME = "cdner-x.q-dit.com"
SERVICE = "http://127.0.0.1:5173"
TUNNEL_NAME = "featsrv-tunnel"


def main() -> int:
    if not CONFIG.exists():
        print(f"missing {CONFIG}", file=sys.stderr)
        return 1
    text = CONFIG.read_text()
    if HOSTNAME in text:
        print(f"{HOSTNAME} already present")
        return 0
    rule = f"  - hostname: {HOSTNAME}\n    service: {SERVICE}\n"
    if re.search(r"(?m)^  - service: http_status:404\s*$", text):
        text = re.sub(
            r"(?m)^  - service: http_status:404\s*$",
            rule + "  - service: http_status:404",
            text,
            count=1,
        )
    elif "ingress:" in text:
        text = text.rstrip() + "\n" + rule
    else:
        print("no ingress: block found", file=sys.stderr)
        return 1
    CONFIG.write_text(text)
    print(f"inserted {HOSTNAME} -> {SERVICE}")
    subprocess.run(
        ["cloudflared", "tunnel", "route", "dns", TUNNEL_NAME, HOSTNAME],
        check=False,
    )
    subprocess.run(["pkill", "-HUP", "-f", "cloudflared tunnel"], check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
