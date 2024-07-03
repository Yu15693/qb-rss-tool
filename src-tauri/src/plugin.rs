use log::LevelFilter;
use tauri::{plugin::TauriPlugin, Wry};
use tauri_plugin_log::{fern::colors::ColoredLevelConfig, LogTarget};

/// log config
pub fn get_plugin_log() -> TauriPlugin<Wry> {
    // debug mode: add webview target
    #[cfg(debug_assertions)]
    const LOG_TARGETS: [LogTarget; 3] = [LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview];
    #[cfg(debug_assertions)]
    const LOG_LEVEL: LevelFilter = LevelFilter::Debug;

    #[cfg(not(debug_assertions))]
    const LOG_TARGETS: [LogTarget; 2] = [LogTarget::LogDir, LogTarget::Stdout];
    #[cfg(not(debug_assertions))]
    const LOG_LEVEL: LevelFilter = LevelFilter::Info;

    tauri_plugin_log::Builder::default()
        .targets(LOG_TARGETS)
        .with_colors(ColoredLevelConfig::default())
        .level(LOG_LEVEL)
        .build()
}
