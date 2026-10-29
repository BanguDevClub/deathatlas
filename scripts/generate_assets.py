#!/usr/bin/env python3
"""
Generate high-resolution, minimal OG images and favicons for Death Atlas.
Designed for maximum legibility, zero text-overflow, and clean modern aesthetics.
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

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

# 2. Generate Ultra-Crisp OG Image (Render at 2x: 2400 x 1260, downscale to 1200 x 630)
scale = 2
final_w, final_h = 1200, 630
W, H = final_w * scale, final_h * scale

# Deep obsidian dark background
img = Image.new("RGBA", (W, H), (9, 13, 22, 255))

# Soft ambient glowing gradient background
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
# Cyan radial glow in top right
glow_draw.ellipse([W - int(800 * scale), -int(200 * scale), W + int(300 * scale), int(650 * scale)], fill=(56, 189, 248, 28))
# Indigo radial glow in bottom left
glow_draw.ellipse([-int(250 * scale), H - int(600 * scale), int(550 * scale), H + int(200 * scale)], fill=(129, 140, 248, 20))
glow = glow.filter(ImageFilter.GaussianBlur(int(85 * scale)))
img = Image.alpha_composite(img, glow)

draw = ImageDraw.Draw(img)

# Load fonts with fallbacks
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 54 * scale)
    font_sub1 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 21 * scale)
    font_sub2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16 * scale)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12 * scale)
    font_pill = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12 * scale)
    font_card_val = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 34 * scale)
    font_card_lbl = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14 * scale)
    font_card_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 11 * scale)
    font_foot = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13 * scale)
    font_foot_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13 * scale)
except Exception:
    font_title = ImageFont.load_default()
    font_sub1 = font_title
    font_sub2 = font_title
    font_badge = font_title
    font_pill = font_title
    font_card_val = font_title
    font_card_lbl = font_title
    font_card_sub = font_title
    font_foot = font_title
    font_foot_bold = font_title

# Outer subtle border framing the card
border_margin = 16 * scale
draw.rounded_rectangle(
    [border_margin, border_margin, W - border_margin, H - border_margin],
    radius=16 * scale,
    outline=(30, 41, 59, 190),
    width=1 * scale
)

margin_x = 75 * scale
margin_y = 60 * scale

# -------------------------------------------------------------
# Top Header Bar: Dynamic Badges
# -------------------------------------------------------------
# Left Badge: Brand + Project
t_brand = "BANGUDEVCLUB  /  DEATH ATLAS"
bbox_brand = font_badge.getbbox(t_brand)
text_brand_w = bbox_brand[2] - bbox_brand[0]
badge_h = 32 * scale
badge_left_w = text_brand_w + (44 * scale)
badge_left_y = margin_y

draw.rounded_rectangle(
    [margin_x, badge_left_y, margin_x + badge_left_w, badge_left_y + badge_h],
    radius=badge_h // 2,
    fill=(15, 23, 42, 230),
    outline=(56, 189, 248, 110),
    width=1 * scale
)
# Glowing cyan status dot
dot_r = 3.5 * scale
dot_cy = badge_left_y + badge_h // 2
dot_cx = margin_x + (15 * scale)
draw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r], fill=(56, 189, 248, 255))
# Text
draw.text((margin_x + (26 * scale), badge_left_y + (8 * scale)), t_brand, font=font_badge, fill=(241, 245, 249, 255))

# Right Badge: Scope + License
t_right = "2025 OBSERVATORY  •  MIT OPEN SOURCE"
bbox_right = font_badge.getbbox(t_right)
text_right_w = bbox_right[2] - bbox_right[0]
badge_right_w = text_right_w + (32 * scale)
badge_right_x = W - margin_x - badge_right_w

draw.rounded_rectangle(
    [badge_right_x, badge_left_y, badge_right_x + badge_right_w, badge_left_y + badge_h],
    radius=badge_h // 2,
    fill=(15, 23, 42, 180),
    outline=(51, 65, 85, 180),
    width=1 * scale
)
draw.text((badge_right_x + (16 * scale), badge_left_y + (8 * scale)), t_right, font=font_badge, fill=(148, 163, 184, 255))

# -------------------------------------------------------------
# Main Title & Subtitle Hierarchy
# -------------------------------------------------------------
title_y = 120 * scale
draw.text((margin_x, title_y), "DEATH ATLAS", font=font_title, fill=(248, 250, 252, 255))

sub1_y = 192 * scale
draw.text((margin_x, sub1_y), "Global Mortality & Cause Avoidability Observatory", font=font_sub1, fill=(148, 163, 184, 255))

sub2_y = 226 * scale
draw.text((margin_x, sub2_y), "Epidemiological taxonomy & ranking index across 195 sovereign nations.", font=font_sub2, fill=(100, 116, 139, 255))

# -------------------------------------------------------------
# Three Pillar Indicator Chips (Never overflow)
# -------------------------------------------------------------
pill_y = 268 * scale
pill_h = 28 * scale
cur_pill_x = margin_x

pillars = [
    ("Natural Causes", (56, 189, 248)),
    ("Accidental Trauma", (245, 158, 11)),
    ("Intentional Trauma", (244, 63, 94))
]

for label, color in pillars:
    bbox = font_pill.getbbox(label)
    text_w = bbox[2] - bbox[0]
    pill_w = text_w + (36 * scale)
    
    # Pill background
    draw.rounded_rectangle(
        [cur_pill_x, pill_y, cur_pill_x + pill_w, pill_y + pill_h],
        radius=pill_h // 2,
        fill=(color[0], color[1], color[2], 25),
        outline=(color[0], color[1], color[2], 90),
        width=1 * scale
    )
    # Color indicator dot
    p_dot_cx = cur_pill_x + (13 * scale)
    p_dot_cy = pill_y + pill_h // 2
    p_dot_r = 3 * scale
    draw.ellipse([p_dot_cx - p_dot_r, p_dot_cy - p_dot_r, p_dot_cx + p_dot_r, p_dot_cy + p_dot_r], fill=color)
    
    # Label
    draw.text((cur_pill_x + (22 * scale), pill_y + (6 * scale)), label, font=font_pill, fill=(226, 232, 240, 255))
    
    cur_pill_x += pill_w + (14 * scale)

# -------------------------------------------------------------
# Right Side Graphic: Clean Modern Geometric Compass & Hourglass
# -------------------------------------------------------------
cx = W - margin_x - (110 * scale)
cy = 195 * scale

# Soft glowing outer aura
draw.ellipse([cx - 95 * scale, cy - 95 * scale, cx + 95 * scale, cy + 95 * scale], fill=(56, 189, 248, 12), outline=(56, 189, 248, 45), width=1 * scale)
# Middle celestial ring
draw.ellipse([cx - 62 * scale, cy - 62 * scale, cx + 62 * scale, cy + 62 * scale], fill=(0, 0, 0, 0), outline=(129, 140, 248, 75), width=1 * scale)
# Inner core ring
draw.ellipse([cx - 30 * scale, cy - 30 * scale, cx + 30 * scale, cy + 30 * scale], fill=(15, 23, 42, 160), outline=(56, 189, 248, 130), width=1 * scale)

# Compass subtle crosshairs
draw.line([(cx - 105 * scale, cy), (cx + 105 * scale, cy)], fill=(56, 189, 248, 40), width=1 * scale)
draw.line([(cx, cy - 105 * scale), (cx, cy + 105 * scale)], fill=(56, 189, 248, 40), width=1 * scale)

# Hourglass geometry
hg_w = 26 * scale
hg_h = 32 * scale
# Top and bottom horizontal lines
draw.line([(cx - hg_w, cy - hg_h), (cx + hg_w, cy - hg_h)], fill=(56, 189, 248, 200), width=2 * scale)
draw.line([(cx - hg_w, cy + hg_h), (cx + hg_w, cy + hg_h)], fill=(56, 189, 248, 200), width=2 * scale)
# Crossing diagonals
draw.line([(cx - hg_w, cy - hg_h), (cx + hg_w, cy + hg_h)], fill=(129, 140, 248, 200), width=2 * scale)
draw.line([(cx + hg_w, cy - hg_h), (cx - hg_w, cy + hg_h)], fill=(129, 140, 248, 200), width=2 * scale)

# Glowing center core
draw.ellipse([cx - 4 * scale, cy - 4 * scale, cx + 4 * scale, cy + 4 * scale], fill=(56, 189, 248, 255))

# -------------------------------------------------------------
# Bottom Section: Three Clean Spacious Metric Cards
# -------------------------------------------------------------
card_y = 368 * scale
card_h = 132 * scale

total_available_w = W - (2 * margin_x)
gap = 24 * scale
card_w = (total_available_w - (2 * gap)) // 3

cards_data = [
    ("195", "Sovereign Nations Covered", "Complete Global Vital Registry", (56, 189, 248)),
    ("62.6M", "Projected 2025 Deaths", "14 Detailed Cause Taxonomies", (192, 132, 252)),
    ("0 — 100", "Avoidability Quality Score", "Mathematical KaTeX Formulation", (245, 158, 11))
]

for i, (val, lbl, sub, color) in enumerate(cards_data):
    card_x = margin_x + i * (card_w + gap)
    
    # Card container
    draw.rounded_rectangle(
        [card_x, card_y, card_x + card_w, card_y + card_h],
        radius=14 * scale,
        fill=(15, 23, 42, 210),
        outline=(51, 65, 85, 170),
        width=1 * scale
    )
    
    # Colored top accent line
    draw.rounded_rectangle(
        [card_x + (16 * scale), card_y, card_x + (70 * scale), card_y + (3 * scale)],
        radius=1 * scale,
        fill=color
    )
    
    # Text contents with generous internal padding (pad_x = 22 * scale)
    pad_x = card_x + (22 * scale)
    draw.text((pad_x, card_y + (18 * scale)), val, font=font_card_val, fill=color)
    draw.text((pad_x, card_y + (68 * scale)), lbl, font=font_card_lbl, fill=(241, 245, 249, 255))
    draw.text((pad_x, card_y + (95 * scale)), sub, font=font_card_sub, fill=(148, 163, 184, 255))

# -------------------------------------------------------------
# Footer Row: Links & Tech Stack
# -------------------------------------------------------------
footer_y = 545 * scale
draw.text((margin_x, footer_y), "github.com/BanguDevClub/deathatlas", font=font_foot_bold, fill=(56, 189, 248, 255))

tech_text = "Astro • React • Tailwind CSS • KaTeX • Recharts"
tech_bbox = font_foot.getbbox(tech_text)
tech_w = tech_bbox[2] - tech_bbox[0]
draw.text((W - margin_x - tech_w, footer_y), tech_text, font=font_foot, fill=(100, 116, 139, 255))

# -------------------------------------------------------------
# Downscale with LANCZOS to 1200 x 630 for Supreme Sharpness
# -------------------------------------------------------------
final_img = img.resize((final_w, final_h), Image.Resampling.LANCZOS)
final_img.save("public/og-image.png", "PNG", optimize=True)

print("✓ Successfully generated public/favicon.svg and public/og-image.png (1200x630, minimal, high-legibility)")
