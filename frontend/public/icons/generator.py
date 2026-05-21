from PIL import Image
import numpy as np
import os

# Input file (red transparent dot)
INPUT_IMAGE = "/home/specapoorv/pythonGui/offline_map/icons/red_waypoint.png"   # change if needed

# Get directory of input image
base_dir = os.path.dirname(os.path.abspath(INPUT_IMAGE))

# Colors to generate (RGB)
COLORS = {
    "yellow": (255, 255, 0),
    "orange": (255, 165, 0),
    "purple": (160, 32, 240),
    "blue":   (0, 120, 255),
    "green":  (0, 200, 0),
    "gray":   (150, 150, 150),
}

# Load image
img = Image.open(INPUT_IMAGE).convert("RGBA")
arr = np.array(img)

# Alpha channel
alpha = arr[:, :, 3]
mask = alpha > 0   # where the dot exists

for name, (r, g, b) in COLORS.items():
    new_arr = arr.copy()
    new_arr[mask, 0] = r
    new_arr[mask, 1] = g
    new_arr[mask, 2] = b

    out_img = Image.fromarray(new_arr, "RGBA")
    out_path = os.path.join(base_dir, f"{name}_waypoint.png")
    out_img.save(out_path)

print("Saved recolored waypoint icons in the same directory.")
