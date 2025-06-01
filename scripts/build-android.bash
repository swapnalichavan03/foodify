#!/bin/bash

set -euo pipefail

# Configuration
ANDROID_DIR="android"
APK_DIR="apk"
APK_NAME="foodify"
GRADLE_TASK="assembleRelease"
APK_SOURCE_PATH="app/build/outputs/apk/release/app-release.apk"

build_android_app() {
    echo "Building Android app..."
    cd "$ANDROID_DIR"
    ./gradlew "$GRADLE_TASK"
    cd ..
}

prepare_apk_dir() {
    echo "Preparing APK directory..."
    mkdir -p "$APK_DIR"
    rm -rf "${APK_DIR:?}"/*
}

copy_apk() {
    local current_date
    current_date=$(date +"%d-%b-%Y")
    # local destination="${APK_DIR}/${APK_NAME}-${current_date}.apk"
    local destination="${APK_DIR}/${APK_NAME}.apk"
    
    echo "Copying APK to destination..."
    cp "${ANDROID_DIR}/${APK_SOURCE_PATH}" "$destination"
    echo "APK copied to: $destination"
}

main() {
    build_android_app
    prepare_apk_dir
    copy_apk
    echo "Build process completed successfully."
}

main