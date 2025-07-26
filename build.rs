const COMMANDS: &[&str] = &[
    "ping",
    "create_purchase",
    "consume",
    "get_product",
    "get_all_purchases",
    "get_subscription",
    "get_list_subscription",
    "create_purchase_subscription",
];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .ios_path("ios")
        .build();
}
