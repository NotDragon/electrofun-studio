use tauri::menu::AboutMetadata;
#[cfg_attr(mobile, tauri::mobile_entry_point)]

use tauri::{
    menu::{MenuItem, Menu, MenuBuilder, SubmenuBuilder, CheckMenuItemBuilder, AboutMetadataBuilder},
    tray::TrayIconBuilder,
	App
};
use std::{fs, path};

fn setup_tray(app: &App) {
	let file_menu = Menu::with_items(app, &[
		&MenuItem::with_id(app, "new".to_string(), "New", true, None::<&str>).unwrap()
	]).unwrap();

	let _ = TrayIconBuilder::new()
		.menu(&file_menu)
		.build(app)
		.unwrap();
}

fn setup_menu(app: &App) {
	let file_menu = SubmenuBuilder::new(app, "File")
    	.text("new", "New")
    	.text("open", "Open")
    	.item(
			&SubmenuBuilder::new(app, "Open Recents")
				.text("a", "A")
				.build()
				.unwrap()
		)
    	.text("save", "Save")
    	.text("save_as", "Save As")
    	.separator()
    	.text("close", "Close")
        .text("open_settings", "Open Settings")
        .build()
		.unwrap();

	let edit_menu = SubmenuBuilder::new(app, "Edit")
    	.undo()
		.redo()
		.separator()
		.build()
		.unwrap();

	let sketch_menu = SubmenuBuilder::new(app, "Sketch")
    	.text("compile", "Compile")
        .text("upload", "Upload")
        .text("compile_binary", "Compile To Binary")
        .build()
		.unwrap();

	let tools_menu = SubmenuBuilder::new(app, "Tools")
    	.text("serial_monitor", "Serial Monitor")
        .text("serial_plotter", "Serial Plotter")
        .build()
		.unwrap();

	let window_menu = SubmenuBuilder::new(app, "Window")
    	.hide()
		.hide_others()
		.separator()
		.minimize()
		.fullscreen()
		.show_all()
		.separator()
		.close_window()
		.build()
		.unwrap();

	let license = fs::read_to_string("license.txt").expect("Unable to read file");

	let help_menu = SubmenuBuilder::new(app, "Help")
    	.about(Some(AboutMetadataBuilder::new()
			.version(Some("0.0.0".to_string()))
			.authors(Some(vec!{"Michalis Chatzittofi".to_string()}))
			.comments(Some("Michalis Chatzittofi 2025 all right reserved".to_string()))
			.license(Some(&*license))
			.website(Some("electrofun.com".to_string()))
			.website_label(Some("Electrofun".to_string()))
			.build()
		))
		.build()
		.unwrap();

		let menu = MenuBuilder::new(app)
		.items(&[&file_menu, &edit_menu, &sketch_menu, &sketch_menu, &tools_menu, &window_menu, &help_menu])
        .build()
		.unwrap();

    app.set_menu(menu).unwrap();


	app.on_menu_event(move |app_handle: &tauri::AppHandle, event| {

                println!("menu event: {:?}", event.id());

                match event.id().0.as_str() {
                    "open" => {
                        println!("open event");
                    }
                    "close" => {
                        println!("close event");
                    }
                    _ => {
                        println!("unexpected menu event");
                    }
                }
            });

}

pub fn run() {
    tauri::Builder::default()
		.setup(|app| {
			

			setup_tray(&app);
			setup_menu(&app);
			


			if cfg!(debug_assertions) {
				app.handle().plugin(
					tauri_plugin_log::Builder::default()
					.level(log::LevelFilter::Info)
					.build(),
				)?;
			}
			Ok(())
		})
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
