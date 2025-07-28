![pliap](https://github.com/tauri-apps/plugins-workspace/raw/v2/plugins/pliap/banner.png)

This plugin provides APIs for handling in-app purchases and subscriptions in Tauri applications, including product queries, purchase creation, consumption, and subscription management.

| Platform | Supported |
| -------- | --------- |
| Linux    | x         |
| Windows  | x         |
| macOS    | x         |
| Android  | ✓         |
| iOS      | x         |

## Install

_This plugin requires a Rust version of at least **1.77.2**_

There are three general methods of installation that we can recommend.

1. Use crates.io and npm (easiest, and requires you to trust that our publishing pipeline worked)
2. Pull sources directly from Github using git tags / revision hashes (most secure)
3. Git submodule install this repo in your tauri project and then use file protocol to ingest the source (most secure, but inconvenient to use)

Install the Core plugin by adding the following to your `Cargo.toml` file:

`src-tauri/Cargo.toml`

```toml
[dependencies]
tauri-plugin-pliap = { git = "https://github.com/lecaobaophuc0912/tauri-plugin-pliap", branch = "v1" }
```

You can install the JavaScript Guest bindings using your preferred JavaScript package manager:

> Note: Since most JavaScript package managers are unable to install packages from git monorepos we provide read-only mirrors of each plugin. This makes installation option 2 more ergonomic to use.

```sh
pnpm add tauri-plugin-pliap
# or
npm add tauri-plugin-pliap
# or
yarn add tauri-plugin-pliap

# alternatively with Git:
pnpm add https://github.com/lecaobaophuc0912/tauri-plugin-pliap#v1
# or
npm add https://github.com/lecaobaophuc0912/tauri-plugin-pliap#v1
# or
yarn add https://github.com/lecaobaophuc0912/tauri-plugin-pliap#v1
```

## Setting up

### Android

This plugin requires the following permissions to be added to your `AndroidManifest.xml` file:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
```

For subscription functionality, you may also need:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

> **Note**: These are normal permissions that are automatically granted when the app is installed. No runtime permission requests are required from the user.

### iOS

For iOS in-app purchases, ensure your app is properly configured with:

- Valid App Store Connect configuration
- Product IDs configured in App Store Connect
- Proper code signing and provisioning profiles

## Usage

First you need to register the core plugin with Tauri:

`src-tauri/src/lib.rs`

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_pliap::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Then, grant the plugin the necessary permissions:

`src-tauri/capabilities/default.json`

```json
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

Afterwards all the plugin's APIs are available through the JavaScript guest bindings:

```javascript
import {
  ping,
  createPurchase,
  createPurchaseSubscription,
  consume,
  getProduct,
  getAllPurchases,
  getSubscription,
  getListSubscription,
} from "@tauri-apps/plugin-pliap";

// Test connection
const response = await ping("test");

// Create a one-time purchase
const purchaseSuccess = await createPurchase("product_id_123");

// Create a subscription purchase
const subscription = await createPurchaseSubscription("subscription_id_456");
if (subscription?.success) {
  console.log("Subscription purchased:", subscription.purchaseToken);
}

// Consume a purchase
const consumed = await consume("purchase_token_here");

// Get product information
const product = await getProduct("product_id_123");
if (product) {
  console.log("Product:", product.title, "Price:", product.price);
}

// Get all user purchases
const purchases = await getAllPurchases();
console.log("User purchases:", purchases);

// Get subscription information
const subscriptionInfo = await getSubscription("subscription_id_456");

// Get multiple subscriptions
const subscriptions = await getListSubscription(["sub_1", "sub_2", "sub_3"]);
```

## API Reference

### Functions

#### `ping(value: string): Promise<string | null>`

Test the plugin connection and return a response.

#### `createPurchase(productId: string): Promise<boolean | null>`

Create a one-time purchase for the specified product ID.

#### `createPurchaseSubscription(productId: string): Promise<SubscriptionPurchaseResponse | null>`

Create a subscription purchase for the specified product ID.

#### `consume(purchaseToken: string): Promise<boolean | null>`

Consume a purchase using its purchase token.

#### `getProduct(productId: string): Promise<BillingProduct | null>`

Get product information for the specified product ID.

#### `getAllPurchases(): Promise<BillingPurchase[]>`

Get all purchases made by the user.

#### `getSubscription(productId: string): Promise<BillingProduct | null>`

Get subscription information for the specified product ID.

#### `getListSubscription(productIds: string[]): Promise<BillingProduct[]>`

Get information for multiple subscription product IDs.

### Types

#### `BillingProduct`

```typescript
type BillingProduct = {
  description: string;
  name: string;
  productId: string;
  productType: string;
  title: string;
  price: string;
};
```

#### `BillingPurchase`

```typescript
type BillingPurchase = {
  developerPayload: string;
  orderId?: string;
  originalJson: string;
  packageName: string;
  products: string[];
  purchaseState: number;
  purchaseTime: number;
  purchaseToken: string;
  quantity: number;
  signature: string;
  isAcknowledged: boolean;
  isAutoRenewing: boolean;
};
```

#### `SubscriptionPurchaseResponse`

```typescript
interface SubscriptionPurchaseResponse {
  success: boolean;
  purchaseToken?: string;
  orderId?: string;
  isAutoRenewing?: boolean;
  pending?: boolean;
}
```

## Contributing

PRs accepted. Please make sure to read the Contributing Guide before making a pull request.

## License

Code: (c) 2015 - Present - The Tauri Programme within The Commons Conservancy.

MIT or MIT/Apache 2.0 where applicable.
