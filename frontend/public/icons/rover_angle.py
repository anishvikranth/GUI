"""
Generate 36 rotated rover images from a single source image
Run this once to create all the rover angle images
"""
from PIL import Image
import os

def generate_rover_angles(input_path="/home/specapoorv/temp_repo/RovMarq/offline_map/icons/rover_icon1.png", output_dir="/home/specapoorv/temp_repo/RovMarq/offline_map/icons/rover_angles"):
    """
    Generate 36 rotated versions of the rover icon (every 10 degrees)
    
    Args:
        input_path: Path to your original rover icon
        output_dir: Directory to save rotated images
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Load the original image
    try:
        img = Image.open(input_path)
        print(f"✓ Loaded image: {input_path}")
        print(f"  Size: {img.size}")
        
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
    except FileNotFoundError:
        print(f"✗ Error: Could not find {input_path}")
        print("  Make sure the file exists!")
        return
    
    # Generate 36 rotated images (0° to 350° in 10° steps)
    for angle in range(0, 360, 10):
        # Rotate image (PIL rotates counter-clockwise, so we negate)
        # Use expand=True to avoid cropping
        rotated = img.rotate(-angle, expand=True, resample=Image.BICUBIC)
        
        # Make sure background is transparent
        # Create a new image with transparent background
        background = Image.new('RGBA', rotated.size, (0, 0, 0, 0))
        background.paste(rotated, (0, 0), rotated)
        
        # Save with angle in filename
        output_path = os.path.join(output_dir, f"rover_{angle:03d}.png")
        background.save(output_path, 'PNG')
        print(f"  Generated: rover_{angle:03d}.png")
    
    print(f"\n✓ Successfully generated 36 rover images in {output_dir}/")
    print(f"  Files: rover_000.png to rover_350.png")

if __name__ == "__main__":
    # Run the generator
    generate_rover_angles()
    
    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("="*60)
    print("1. Check the 'icons/rover_angles/' folder for generated images")
    print("2. Use the updated map.html that references these images")
    print("3. The map will automatically pick the closest angle image!")