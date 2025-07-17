// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    menu::{MenuItem, MenuBuilder, SubmenuBuilder, IconMenuItemBuilder},
    tray::TrayIconBuilder
};

#[tauri::command]
fn upload_code(port: String, code: String) -> Result<String, String> {
    use std::fs::{write};
    use std::process::Command;

    let path = "/tmp/electrobyte_project.ino";
    write(path, code).map_err(|e| e.to_string())?;

    let output = Command::new("arduino-cli")
        .args(&["compile", "--fqbn", "arduino:avr:uno", path])
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    let upload = Command::new("arduino-cli")
        .args(&["upload", "-p", &port, "--fqbn", "arduino:avr:uno", path])
        .output()
        .map_err(|e| e.to_string())?;

    if !upload.status.success() {
        return Err(String::from_utf8_lossy(&upload.stderr).to_string());
    }

    Ok("Upload successful".into())
}


fn main() {
    app_lib::run();
}
