# Tauri Plugin PLIAP (DEPRECATE, NO LONGER MAINTAINED AND DEVELOPMENT)

[![Crates.io](https://img.shields.io/crates/v/tauri-plugin-pliap)](https://crates.io/crates/tauri-plugin-pliap)
[![Crates.io](https://img.shields.io/crates/d/tauri-plugin-pliap)](https://crates.io/crates/tauri-plugin-pliap)
[![License](https://img.shields.io/crates/l/tauri-plugin-pliap)](https://github.com/lecaobaophuc0912/tauri-plugin-pliap/blob/main/LICENSE)

A Tauri plugin for handling in-app purchases and subscriptions across desktop and mobile platforms.

## Features

- ✅ **Cross-platform support**: Desktop (Windows, macOS, Linux) and Mobile (Android, iOS)
- ✅ **In-app purchases**: One-time purchases with Google Play Billing and App Store
- ✅ **Subscriptions**: Recurring subscriptions with multiple base plans
- ✅ **Product management**: Query product information and pricing
- ✅ **Purchase tracking**: Get all user purchases and consumption status
- ✅ **TypeScript support**: Full type definitions for the JavaScript API

## Platform Support

| Platform | Status  | Notes                  |
| -------- | ------- | ---------------------- |
| Android  | ✅ Full | Google Play Billing v6 |

> **ℹ️ Hiện tại plugin chỉ hỗ trợ Android. Hỗ trợ iOS và Desktop sẽ được cập nhật trong tương lai.**

## Installation

### Rust (Cargo.toml)

```toml
[dependencies]
tauri-plugin-pliap = "1.0.6"
```

### JavaScript/TypeScript

```bash
npm install tauri-plugin-pliap
# or
yarn add tauri-plugin-pliap
# or
pnpm add tauri-plugin-pliap
```

## Quick Start

### 1. Register the plugin

```rust
// src-tauri/src/main.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_pliap::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 2. Configure permissions

```json
// src-tauri/capabilities/default.json
{
  "permissions": [
    "core:default",
    "pliap:allow-ping",
    "pliap:allow-create-purchase",
    "pliap:allow-create-purchase-subscription",
    "pliap:allow-consume",
    "pliap:allow-get-product",
    "pliap:allow-get-all-purchases",
    "pliap:allow-get-subscription",
    "pliap:allow-get-list-subscription"
  ]
}
```

### 3. Use in your app

```typescript
import { createPurchase, getProduct } from "tauri-plugin-pliap";

// Create a purchase
const success = await createPurchase("product_id_123");

// Get product info
const product = await getProduct("product_id_123");
console.log("Product:", product.title, "Price:", product.price);
```

## API Reference

### Core Functions

- `ping(value: string)` - Test plugin connection
- `createPurchase(productId: string)` - Create one-time purchase
- `createPurchaseSubscription(options)` - Create subscription
- `consume(purchaseToken: string)` - Consume a purchase
- `getProduct(productId: string)` - Get product information
- `getAllPurchases()` - Get all user purchases
- `getSubscription(productId: string)` - Get subscription info
- `getListSubscription(productIds: string[])` - Get multiple subscriptions

### Key Types

```typescript
interface BillingProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  productType: string;
}

interface SubscriptionPurchaseResponse {
  success: boolean;
  purchaseToken?: string;
  orderId?: string;
  isAutoRenewing?: boolean;
}
```

## Platform Setup

### Android

Add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
<uses-permission android:name="android.permission.INTERNET" />
```

### iOS

Ensure your app has:

- Valid App Store Connect configuration
- Product IDs configured in App Store Connect
- Proper code signing and provisioning profiles

## Examples

See the [examples/tauri-app](./examples/tauri-app) directory for a complete working example.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/lecaobaophuc0912/tauri-plugin-pliap)
- 🐛 [Issues](https://github.com/lecaobaophuc0912/tauri-plugin-pliap/issues)
- 💬 [Discussions](https://github.com/lecaobaophuc0912/tauri-plugin-pliap/discussions)

## Publish

cargo login <your-api-token>

Publish test, not upload: cargo publish --dry-run

cargo publish
