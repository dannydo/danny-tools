#!/bin/bash

# Exit on error
set -e

APP_NAME="MenuBarDotSeparator"
APP_DIR="${APP_NAME}.app"
CONTENTS_DIR="${APP_DIR}/Contents"
MACOS_DIR="${CONTENTS_DIR}/MacOS"
RESOURCES_DIR="${CONTENTS_DIR}/Resources"

echo "Building ${APP_NAME}..."

# Clean previous build
rm -rf "${APP_DIR}"

# Create directory structure
mkdir -p "${MACOS_DIR}"
mkdir -p "${RESOURCES_DIR}"

# Compile Swift code
swiftc main.swift -o "${MACOS_DIR}/${APP_NAME}"

# Copy App Icon
if [ -f "AppIcon.icns" ]; then
    cp AppIcon.icns "${RESOURCES_DIR}/AppIcon.icns"
fi

# Copy Info.plist
cp Info.plist "${CONTENTS_DIR}/Info.plist"

# Code sign the app using Apple Developer Certificate
codesign --force --deep --sign "-" "${APP_DIR}"

echo "Build complete: ${APP_DIR} has been created."
