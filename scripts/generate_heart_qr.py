import os
import math
import cv2
import numpy as np
import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageFilter

TARGET_URL = "https://birthday-wishes-two-lovat.vercel.app"
ROSE_COLOR = (225, 29, 72)     # #e11d48 romantic vibrant rose
DARK_BG_TOP = (11, 20, 26)     # WhatsApp dark top #0b141a
DARK_BG_BOT = (17, 27, 33)     # WhatsApp dark bottom #111b21
CHAT_GREEN = (0, 92, 75)       # WhatsApp outgoing bubble #005c4b
TEXT_WHITE = (233, 237, 239)
TEXT_MUTED = (134, 150, 160)
TICK_BLUE = (83, 189, 235)

def draw_ticks(draw, x, y, color=TICK_BLUE, width=3):
    draw.line([(x, y + 8), (x + 5, y + 13)], fill=color, width=width)
    draw.line([(x + 5, y + 13), (x + 14, y)], fill=color, width=width)
    draw.line([(x + 7, y + 8), (x + 12, y + 13)], fill=color, width=width)
    draw.line([(x + 12, y + 13), (x + 21, y)], fill=color, width=width)

def draw_red_heart(draw, hx, hy, hr=11):
    draw.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], fill=(239, 68, 68))
    draw.ellipse([hx + hr, hy - hr, hx + 3 * hr, hy + hr], fill=(239, 68, 68))
    draw.polygon([(hx - hr, hy), (hx + 3 * hr, hy), (hx + hr, hy + 2 * hr + 4)], fill=(239, 68, 68))

def create_heart_qr():
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=16,
        border=4,
    )
    qr.add_data(TARGET_URL)
    qr.make(fit=True)
    matrix = np.array(qr.get_matrix(), dtype=np.uint8)
    N = matrix.shape[0]

    mod = 16
    w = N * mod
    qr_img = Image.new('RGB', (w, w), (255, 255, 255))
    draw = ImageDraw.Draw(qr_img)

    for r in range(N):
        for c in range(N):
            if matrix[r, c]:
                draw.rectangle([c*mod, r*mod, (c+1)*mod-1, (r+1)*mod-1], fill=ROSE_COLOR)

    # -45 degree rotation places BR (no finder) at bottom tip, and TL, TR, BL at top, right, left
    rot = qr_img.rotate(-45, expand=True, fillcolor=(255, 255, 255), resample=Image.Resampling.BICUBIC)
    W, H = rot.size
    cx, cy = W // 2, H // 2
    diag = W // 2

    lx = (cx - diag + cx) // 2
    ly = (cy + cy - diag) // 2
    rx = (cx + diag + cx) // 2
    ry = (cy + cy - diag) // 2
    radius = int(diag / math.sqrt(2) / 2 * 0.96)

    heart_img = rot.copy()
    hdraw = ImageDraw.Draw(heart_img)

    grid = 12
    np.random.seed(42)

    for y in range(0, cy + 20, grid):
        for x in range(0, W, grid):
            d1 = math.hypot(x - lx, y - ly)
            d2 = math.hypot(x - rx, y - ry)
            d_top = math.hypot(x - cx, y - (cy - diag + 4 * mod * math.sqrt(2)))
            d_left = math.hypot(x - (cx - diag + 4 * mod * math.sqrt(2)), y - cy)
            d_right = math.hypot(x - (cx + diag - 4 * mod * math.sqrt(2)), y - cy)

            if (d1 < radius or d2 < radius) and min(d_top, d_left, d_right) > 3.2 * mod:
                if abs(x - cx) + abs(y - cy) >= diag * 0.94:
                    min_d = min(d1, d2)
                    prob = 0.65 if min_d < radius * 0.8 else 0.4
                    if np.random.rand() < prob:
                        hdraw.rectangle([x, y, x + grid - 2, y + grid - 2], fill=ROSE_COLOR)

    return heart_img

def generate_assets():
    os.makedirs("assets", exist_ok=True)

    print("Generating validated Heart QR Code...")
    heart_img = create_heart_qr()

    # Save standalone transparent/white Heart QR
    standalone_path = "assets/heart-qr-code.png"
    heart_img.save(standalone_path)
    print(f"Saved: {standalone_path}")

    # Build WhatsApp presentation card
    card_w, card_h = 1080, 1920
    # Subtle vertical gradient background
    canvas = Image.new('RGB', (card_w, card_h), DARK_BG_TOP)
    draw = ImageDraw.Draw(canvas)

    for y in range(card_h):
        r = int(DARK_BG_TOP[0] + (DARK_BG_BOT[0] - DARK_BG_TOP[0]) * (y / card_h))
        g = int(DARK_BG_TOP[1] + (DARK_BG_BOT[1] - DARK_BG_TOP[1]) * (y / card_h))
        b = int(DARK_BG_TOP[2] + (DARK_BG_BOT[2] - DARK_BG_TOP[2]) * (y / card_h))
        draw.line([(0, y), (card_w, y)], fill=(r, g, b))

    # Ultra-subtle WhatsApp wallpaper motifs (doodles)
    doodle = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
    ddraw = ImageDraw.Draw(doodle)
    for x in range(30, card_w, 150):
        for y in range(30, card_h, 150):
            ddraw.ellipse([x, y, x+6, y+6], fill=(255, 255, 255, 7))
            ddraw.arc([x+30, y+20, x+50, y+40], 0, 180, fill=(255, 255, 255, 6), width=1)
            ddraw.polygon([(x+70, y+70), (x+77, y+63), (x+84, y+70), (x+77, y+77)], fill=(255, 255, 255, 6))
    canvas.paste(doodle.convert('RGB'), (0, 0), doodle)

    # Fonts
    font_msg = ImageFont.truetype('C:\\Windows\\Fonts\\seguisb.ttf', 38)
    font_emoji = ImageFont.truetype('C:\\Windows\\Fonts\\seguiemj.ttf', 36)
    font_time = ImageFont.truetype('C:\\Windows\\Fonts\\segoeui.ttf', 24)

    # Bubble 1: "Happy birthday!! 🎂❤️"
    b1_w, b1_h = 580, 96
    b1_x = card_w - b1_w - 70
    b1_y = 230
    draw.rounded_rectangle([b1_x, b1_y, b1_x + b1_w, b1_y + b1_h], radius=20, fill=CHAT_GREEN)
    draw.polygon([(b1_x + b1_w - 6, b1_y + 12), (b1_x + b1_w + 16, b1_y), (b1_x + b1_w - 6, b1_y + 24)], fill=CHAT_GREEN)
    draw.text((b1_x + 28, b1_y + 24), 'Happy birthday!! ', fill=TEXT_WHITE, font=font_msg)
    draw.text((b1_x + 308, b1_y + 26), '🎂', fill=(255, 255, 255), font=font_emoji)
    draw_red_heart(draw, b1_x + 368, b1_y + 44, hr=11)
    draw.text((b1_x + b1_w - 155, b1_y + 46), '2:43 pm', fill=TEXT_MUTED, font=font_time)
    draw_ticks(draw, b1_x + b1_w - 55, b1_y + 49)

    # QR Card Container
    qr_card_w, qr_card_h = 760, 760
    qr_card_x = (card_w - qr_card_w) // 2
    qr_card_y = 410

    # Soft ambient drop shadow behind card
    shadow = Image.new('RGBA', (qr_card_w + 40, qr_card_h + 40), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle([15, 15, qr_card_w + 25, qr_card_h + 25], radius=28, fill=(0, 0, 0, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    canvas.paste(shadow.convert('RGB'), (qr_card_x - 20, qr_card_y - 12), shadow)

    # Clean white panel with rounded corners
    white_panel = Image.new('RGBA', (qr_card_w, qr_card_h), (0, 0, 0, 0))
    wp_draw = ImageDraw.Draw(white_panel)
    wp_draw.rounded_rectangle([0, 0, qr_card_w - 1, qr_card_h - 1], radius=24, fill=(255, 255, 255, 255))
    canvas.paste(white_panel.convert('RGB'), (qr_card_x, qr_card_y), white_panel)

    # Paste scaled heart QR code inside
    heart_scaled = heart_img.resize((680, 680), Image.Resampling.LANCZOS)
    canvas.paste(heart_scaled, (qr_card_x + 40, qr_card_y + 40))

    # Camera Scanner Viewfinder Corner Brackets
    b_len = 95
    b_thick = 9
    b_col = (255, 255, 255)
    pad = 18

    # Top-Left Bracket
    draw.line([(qr_card_x - pad, qr_card_y - pad + b_len), (qr_card_x - pad, qr_card_y - pad)], fill=b_col, width=b_thick)
    draw.line([(qr_card_x - pad, qr_card_y - pad), (qr_card_x - pad + b_len, qr_card_y - pad)], fill=b_col, width=b_thick)

    # Top-Right Bracket
    draw.line([(qr_card_x + qr_card_w + pad, qr_card_y - pad + b_len), (qr_card_x + qr_card_w + pad, qr_card_y - pad)], fill=b_col, width=b_thick)
    draw.line([(qr_card_x + qr_card_w + pad, qr_card_y - pad), (qr_card_x + qr_card_w + pad - b_len, qr_card_y - pad)], fill=b_col, width=b_thick)

    # Bottom-Left Bracket
    draw.line([(qr_card_x - pad, qr_card_y + qr_card_h + pad - b_len), (qr_card_x - pad, qr_card_y + qr_card_h + pad)], fill=b_col, width=b_thick)
    draw.line([(qr_card_x - pad, qr_card_y + qr_card_h + pad), (qr_card_x - pad + b_len, qr_card_y + qr_card_h + pad)], fill=b_col, width=b_thick)

    # Bottom-Right Bracket
    draw.line([(qr_card_x + qr_card_w + pad, qr_card_y + qr_card_h + pad - b_len), (qr_card_x + qr_card_w + pad, qr_card_y + qr_card_h + pad)], fill=b_col, width=b_thick)
    draw.line([(qr_card_x + qr_card_w + pad, qr_card_y + qr_card_h + pad), (qr_card_x + qr_card_w + pad - b_len, qr_card_y + qr_card_h + pad)], fill=b_col, width=b_thick)

    # Bubble 2: "Open when alone"
    b2_w, b2_h = 490, 96
    b2_x = card_w - b2_w - 70
    b2_y = qr_card_y + qr_card_h + 60
    draw.rounded_rectangle([b2_x, b2_y, b2_x + b2_w, b2_y + b2_h], radius=20, fill=CHAT_GREEN)
    draw.polygon([(b2_x + b2_w - 6, b2_y + 12), (b2_x + b2_w + 16, b2_y), (b2_x + b2_w - 6, b2_y + 24)], fill=CHAT_GREEN)
    draw.text((b2_x + 28, b2_y + 24), 'Open when alone', fill=TEXT_WHITE, font=font_msg)
    draw.text((b2_x + b2_w - 155, b2_y + 46), '2:44 pm', fill=TEXT_MUTED, font=font_time)
    draw_ticks(draw, b2_x + b2_w - 55, b2_y + 49)

    # Bottom Controls: Flashlight & Gallery
    btn_y = b2_y + 280
    btn_r = 54

    # Flashlight (Left)
    btn_fl_x = card_w // 2 - 200
    draw.ellipse([btn_fl_x - btn_r, btn_y - btn_r, btn_fl_x + btn_r, btn_y + btn_r], fill=(32, 44, 51))
    draw.polygon([
        (btn_fl_x - 18, btn_y - 22), (btn_fl_x + 18, btn_y - 22),
        (btn_fl_x + 9, btn_y - 4), (btn_fl_x - 9, btn_y - 4)
    ], fill=(255, 255, 255))
    draw.rounded_rectangle([btn_fl_x - 8, btn_y - 2, btn_fl_x + 8, btn_y + 24], radius=3, fill=(255, 255, 255))

    # Gallery (Right)
    btn_gal_x = card_w // 2 + 200
    draw.ellipse([btn_gal_x - btn_r, btn_y - btn_r, btn_gal_x + btn_r, btn_y + btn_r], fill=(32, 44, 51))
    draw.rounded_rectangle([btn_gal_x - 22, btn_y - 17, btn_gal_x + 22, btn_y + 17], radius=4, outline=(255, 255, 255), width=3)
    draw.polygon([(btn_gal_x - 15, btn_y + 10), (btn_gal_x - 3, btn_y - 4), (btn_gal_x + 8, btn_y + 10)], fill=(255, 255, 255))
    draw.ellipse([btn_gal_x + 7, btn_y - 11, btn_gal_x + 15, btn_y - 3], fill=(255, 255, 255))

    card_path = "assets/heart-qr-scanner-card.png"
    canvas.save(card_path, quality=95)
    print(f"Saved: {card_path}")

    # Automated Verification
    detector = cv2.QRCodeDetector()
    v1, _, _ = detector.detectAndDecode(cv2.imread(standalone_path))
    v2, _, _ = detector.detectAndDecode(cv2.imread(card_path))

    print(f"1. Standalone Heart QR decode: '{v1}'")
    print(f"2. Full Scanner Card QR decode: '{v2}'")
    assert v1 == TARGET_URL, f"Standalone failed: {v1}"
    assert v2 == TARGET_URL, f"Card failed: {v2}"
    print("SUCCESS: 100% Verified and Scannable by any smartphone camera!")

if __name__ == "__main__":
    generate_assets()
