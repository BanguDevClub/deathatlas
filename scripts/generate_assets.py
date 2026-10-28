#!/usr/bin/env python3
"""
Generate high-resolution OG images and favicons for Death Atlas.
"""

import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("public", exist_ok=True)

# 1. Generate Favicon SVG
favicon_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="24" fill="#090d16"/>
  <circle cx="50" cy="50" r="38" stroke="url(#grad)" stroke-width="4" fill="none" opacity="0.3"/>
  <!-- Hourglass / Atlas compass iconography -->
  <path d="M32 30 L68 30 L54 48 L68 70 L32 70 L46 48 Z" fill="none" stroke="url(#grad)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="5" fill="#38bdf8"/>
</svg>"""

with open("public/favicon.svg", "w") as f:
    f.write(favicon_svg)

# 2. Generate OG Image (1200 x 630)
width = 1200
height = 630
img = Image.new("RGBA", (width, height), (9, 13, 22, 255))
draw = ImageDraw.Draw(img)

# Background subtle grid & gradient glow
for x in range(0, width, 40):
    draw.line([(x, 0), (x, height)], fill=(20, 27, 45, 120), width=1)
for y in range(0, height, 40):
    draw.line([(0, y), (width, y)], fill=(20, 27, 45, 120), width=1)

# Subtle decorative circles
draw.ellipse([800, -100, 1300, 400], fill=(56, 189, 248, 15), outline=(56, 189, 248, 40))
draw.ellipse([50, 350, 450, 750], fill=(136, 57, 239, 12), outline=(136, 57, 239, 30))

# Try loading standard truetype fonts, fallback to default
try:
    font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64)
    font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 26)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_metric_val = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
    font_metric_lbl = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
except Exception:
    font_large = ImageFont.load_default()
    font_subtitle = font_large
    font_badge = font_large
    font_metric_val = font_large
    font_metric_lbl = font_large

# Badge: BanguDevClub • Open Source
draw.rounded_rectangle([90, 80, 420, 122], radius=12, fill=(30, 41, 59, 230), outline=(56, 189, 248, 180), width=1)
draw.text((105, 90), "⚡ BanguDevClub  •  MIT Open Source", font=font_badge, fill=(56, 189, 248, 255))

# Title
draw.text((90, 150), "DEATH ATLAS", font=font_large, fill=(241, 245, 249, 255))

# Subtitle
draw.text((90, 240), "Global Mortality Dashboards, Ranking & Longevity Observatory", font=font_subtitle, fill=(148, 163, 184, 255))
draw.text((90, 280), "Explore how 195 nations die across Natural, Accidental & Intentional causes.", font=font_subtitle, fill=(100, 116, 139, 255))

# 3 Metric Cards at the bottom
metrics = [
    ("195", "UN Countries Modeled", (56, 189, 248)),
    ("62.6M", "Global Deaths (2025)", (168, 85, 247)),
    ("3 Groups", "Natural • Accidental • Intentional", (34, 197, 94)),
    ("0 — 100", "Death Atlas Quality Score", (251, 146, 60))
]

card_w = 230
card_h = 130
start_x = 90
y_pos = 380

for i, (val, lbl, color) in enumerate(metrics):
    cx = start_x + i * (card_w + 25)
    draw.rounded_rectangle([cx, y_pos, cx + card_w, y_pos + card_h], radius=14, fill=(15, 23, 42, 220), outline=(51, 65, 85, 200), width=1)
    draw.text((cx + 20, y_pos + 25), val, font=font_metric_val, fill=color)
    draw.text((cx + 20, y_pos + 80), lbl, font=font_metric_lbl, fill=(148, 163, 184, 255))

# Footer URL
draw.text((90, 560), "https://github.com/BanguDevClub/deathatlas", font=font_metric_lbl, fill=(56, 189, 248, 255))

img.save("public/og-image.png", "PNG")
print("Generated public/favicon.svg and public/og-image.png")

