# Worst-case (90th-percentile-bright) backdrop behind each hero text element vs ivory text.
import json
from PIL import Image
IVORY = (247, 243, 236)
def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def lum(rgb):
    r, g, b = rgb
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
L_IVORY = lum(IVORY)
data = json.load(open('qa/out/contrast/boxes.json'))
worst = {}
for frame in data:
    im = Image.open(frame['file']).convert('RGB')
    for kind, boxes in frame['boxes'].items():
        for b in boxes:
            x0, y0 = max(0, int(b['x'])), max(0, int(b['y']))
            x1, y1 = min(im.width, int(b['x'] + b['width'])), min(im.height, int(b['y'] + b['height']))
            if x1 <= x0 or y1 <= y0:
                continue
            raw = im.crop((x0, y0, x1, y1)).tobytes()
            px = sorted(lum(raw[i:i + 3]) for i in range(0, len(raw), 3))
            p90 = px[int(len(px) * 0.9)]
            ratio = (L_IVORY + 0.05) / (p90 + 0.05)
            key = (frame['viewport'], kind, b['sel'])
            if key not in worst or ratio < worst[key][0]:
                worst[key] = (ratio, frame['t'])
fail = 0
for (vp, kind, sel), (ratio, t) in sorted(worst.items()):
    need = 3.0 if kind == 'large' else 4.5
    ok = ratio >= need
    fail += not ok
    print(f"{'OK ' if ok else 'LOW'} {vp:7s} {kind:5s} {ratio:5.2f} (need {need}) t={t:<5} {sel}")
print('failures:', fail)
