use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::Pliap;
#[cfg(mobile)]
use mobile::Pliap;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the pliap APIs.
pub trait PliapExt<R: Runtime> {
    fn pliap(&self) -> &Pliap<R>;
}

impl<R: Runtime, T: Manager<R>> crate::PliapExt<R> for T {
    fn pliap(&self) -> &Pliap<R> {
        self.state::<Pliap<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("pliap")
        .invoke_handler(tauri::generate_handler![
            commands::ping,
            commands::create_purchase,
            commands::create_purchase_subscription,
            commands::consume,
            commands::get_product,
            commands::get_all_purchases,
            commands::get_subscription,
            commands::get_list_subscription,
        ])
        .setup(|app, api| {
            #[cfg(mobile)]
            let pliap = mobile::init(app, api)?;
            #[cfg(desktop)]
            let pliap = desktop::init(app, api)?;
            app.manage(pliap);
            Ok(())
        })
        .build()
}
