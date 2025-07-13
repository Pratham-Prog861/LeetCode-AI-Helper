#!/usr/bin/env python3
"""
Installation script for LeetCode AI Helper Chrome Extension
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def print_banner():
    """Print the installation banner"""
    print("=" * 60)
    print("🚀 LeetCode AI Helper Chrome Extension Installer")
    print("=" * 60)
    print()

def check_files():
    """Check if all required files exist"""
    required_files = [
        "popup.html",
        "popup.css", 
        "popup.js",
        "manifest.json",
        "icon.svg"
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ All required files found!")
    return True

def create_icons():
    """Create PNG icons from SVG"""
    print("\n📱 Creating extension icons...")
    
    if os.path.exists("create_icons.py"):
        try:
            result = subprocess.run([sys.executable, "create_icons.py"], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print("✅ Icons created successfully!")
                return True
            else:
                print("⚠️  Icon creation failed, but you can continue with manual setup")
                return False
        except Exception as e:
            print(f"⚠️  Error creating icons: {e}")
            return False
    else:
        print("⚠️  create_icons.py not found. You'll need to create icons manually.")
        return False

def open_chrome_extensions():
    """Open Chrome extensions page"""
    print("\n🌐 Opening Chrome Extensions page...")
    try:
        webbrowser.open("chrome://extensions/")
        print("✅ Chrome Extensions page opened!")
        return True
    except Exception as e:
        print(f"❌ Could not open Chrome Extensions page: {e}")
        return False

def print_instructions():
    """Print installation instructions"""
    print("\n" + "=" * 60)
    print("📋 INSTALLATION INSTRUCTIONS")
    print("=" * 60)
    print()
    print("1. 🔧 Enable Developer Mode:")
    print("   - In the Chrome Extensions page, toggle 'Developer mode' ON")
    print("   - It's located in the top-right corner")
    print()
    print("2. 📁 Load Extension:")
    print("   - Click 'Load unpacked' button")
    print("   - Select this folder containing the extension files")
    print()
    print("3. 🔑 Set Up API Key:")
    print("   - Get your free Gemini API key from:")
    print("     https://makersuite.google.com/app/apikey")
    print("   - Click the extension icon in your toolbar")
    print("   - Paste your API key and click 'Save Key'")
    print()
    print("4. 🎯 Start Using:")
    print("   - Go to any LeetCode problem page")
    print("   - Click the extension icon")
    print("   - Choose Hints, Approach, or Code")
    print()
    print("📚 For detailed instructions, see README.md")
    print()

def main():
    """Main installation function"""
    print_banner()
    
    # Check if we're in the right directory
    if not check_files():
        print("\n❌ Please run this script from the extension directory!")
        return
    
    # Create icons
    create_icons()
    
    # Open Chrome extensions page
    open_chrome_extensions()
    
    # Print instructions
    print_instructions()
    
    print("🎉 Installation guide completed!")
    print("Follow the instructions above to complete the setup.")

if __name__ == "__main__":
    main() 