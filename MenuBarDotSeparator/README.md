# MenuBarDotSeparator

A simple, lightweight macOS utility that replaces Bartender by allowing you to add customizable dot separators (`•`) to your menu bar. 

This app helps you neatly organize your menu bar icons by placing small dot separators between groups of other icons.

## Features
- **Minimalist dot separator** (`•`) for your macOS menu bar.
- **Dynamic control:** Right-click any dot to instantly add more dots or remove them, saving their counts automatically.
- **Auto-save system:** Positions and dot counts are saved automatically when restarted.
- **Resource efficient:** Written directly in Swift with macOS native APIs; it runs completely in the background with near-zero performance overhead.

## Installation 

### Option 1: Quick Install (Recommended)
1. Download the latest installation file: [`MenuBarDotSeparator.zip`](./MenuBarDotSeparator.zip)
2. Unzip the downloaded file.
3. Drag `MenuBarDotSeparator.app` into your **Applications** folder.
4. Double-click to open. 
   > **Note:** Because this app is self-built, macOS may show a warning about an unidentified developer. In that case, **Control-click (or right-click)** the app icon and select **Open**, or go to **System Settings > Privacy & Security** and select **Open Anyway**.

### Option 2: Build from Source
If you prefer to compile it yourself:
1. Clone this repository.
2. Open Terminal and navigate to the `MenuBarDotSeparator` directory.
3. Run the included build script:
   ```bash
   ./build.sh
   ```
4. The script will generate `MenuBarDotSeparator.app` in the exact same folder. You can move it to your Applications folder and run it.

## Usage
- **Hold `Cmd (⌘)` and click-and-drag** to move your newly placed dot `•` around your menu bar. Setup your custom organization!
- **Right-click** the separator dot to:
  - `+ Add Dot`: Creates another dot.
  - `- Remove This Dot`: Removes the currently right-clicked dot.
  - `Quit`: Exits the application and removes all active dots from your menu bar until re-opened.

## Requirements
- macOS 11.0 or later.
