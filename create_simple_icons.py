#!/usr/bin/env python3
"""
Simple script to create basic PNG icons for Chrome extension
Uses only PIL/Pillow - no external dependencies
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple icon with the specified size"""
    # Create a new image with gradient background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Create gradient background (purple to blue)
    for y in range(size):
        # Calculate gradient color
        ratio = y / size
        r = int(102 * (1 - ratio) + 118 * ratio)  # 102->118
        g = int(126 * (1 - ratio) + 75 * ratio)   # 126->75
        b = int(234 * (1 - ratio) + 162 * ratio)  # 234->162
        
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    # Add a white circle in the center
    center = size // 2
    circle_radius = size // 4
    draw.ellipse([center - circle_radius, center - circle_radius, 
                  center + circle_radius, center + circle_radius], 
                 fill=(255, 255, 255, 200))
    
    # Add code brackets
    bracket_size = size // 6
    # Left bracket
    draw.text((center - bracket_size//2, center - bracket_size//2), 
              "{", fill=(102, 126, 234, 255), 
              font=ImageFont.load_default())
    # Right bracket  
    draw.text((center + bracket_size//2, center + bracket_size//2), 
              "}", fill=(102, 126, 234, 255), 
              font=ImageFont.load_default())
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"✓ Created {filename} ({size}x{size})")

def main():
    """Create all required icon sizes"""
    print("Creating Chrome extension icons...")
    
    # Icon sizes needed for Chrome extension
    sizes = [16, 48, 128]
    
    success_count = 0
    for size in sizes:
        filename = f"icon{size}.png"
        try:
            create_icon(size, filename)
            success_count += 1
        except Exception as e:
            print(f"✗ Error creating {filename}: {e}")
    
    print(f"\n✓ Successfully created {success_count}/{len(sizes)} icon files")
    
    if success_count == len(sizes):
        print("🎉 All icons created successfully!")
        print("You can now load the extension in Chrome.")
    else:
        print("⚠️  Some icons failed to create. Check the errors above.")

if __name__ == "__main__":
    main() 