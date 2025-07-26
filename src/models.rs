use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PingRequest {
    pub value: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PingResponse {
    pub value: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PurchaseRequest {
    /// The product id of the product to purchase.
    pub product_id: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsumeRequest {
    /// The purchase token used for consume request
    pub purchase_token: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscriptionListRequest {
    /// List of subscription product IDs to query
    pub product_ids: Vec<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PurchaseResponse {
    /// Wether the purchase was succesful or not
    pub success: bool,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscriptionPurchaseResponse {
    /// Whether the subscription purchase was successful or not
    pub success: bool,
    /// The purchase token for the subscription
    pub purchase_token: Option<String>,
    /// The order ID for the subscription
    pub order_id: Option<String>,
    /// Whether the subscription is auto-renewing
    pub is_auto_renewing: Option<bool>,
    /// Whether the purchase is pending (for subscriptions)
    pub pending: Option<bool>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Product {
    pub description: String,
    pub name: String,
    pub product_id: String,
    pub product_type: String,
    pub title: String,
    pub price: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Purchase {
    pub developer_payload: String,
    pub order_id: Option<String>,
    pub original_json: String,
    pub package_name: String,
    pub products: Vec<String>,
    pub purchase_state: i32,
    pub purchase_time: i128,
    pub purchase_token: String,
    pub quantity: i32,
    pub signature: String,
    pub is_acknowledged: bool,
    pub is_auto_renewing: bool,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProductsResponse {
    /// A list of products
    pub products: Vec<Product>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PurchasesResponse {
    /// A list of purchases
    pub purchases: Vec<Purchase>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscriptionListResponse {
    /// A list of subscription products
    pub subscriptions: Vec<Product>,
}
