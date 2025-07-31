use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> crate::Result<Pliap<R>> {
    Ok(Pliap(app.clone()))
}

/// Access to the pliap APIs.
pub struct Pliap<R: Runtime>(AppHandle<R>);

impl<R: Runtime> Pliap<R> {
    pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
        Ok(PingResponse {
            value: payload.value,
        })
    }

    pub fn create_purchase(&self, _payload: PurchaseRequest) -> crate::Result<PurchaseResponse> {
        // Mock implementation for desktop
        Ok(PurchaseResponse { success: false })
    }

    pub fn create_purchase_subscription(
        &self,
        _payload: SubscriptionPurchaseRequest,
    ) -> crate::Result<SubscriptionPurchaseResponse> {
        // Mock implementation for desktop
        Ok(SubscriptionPurchaseResponse {
            success: false,
            purchase_token: None,
            order_id: None,
            is_auto_renewing: None,
            pending: None,
            base_plan_id: None,
            offer_token: None,
            product_id: None,
            price: None,
        })
    }

    pub fn consume(&self, _payload: ConsumeRequest) -> crate::Result<PurchaseResponse> {
        // Mock implementation for desktop
        Ok(PurchaseResponse { success: false })
    }

    pub fn get_product(&self, _payload: PurchaseRequest) -> crate::Result<ProductsResponse> {
        // Mock implementation for desktop
        Ok(ProductsResponse { products: vec![] })
    }

    pub fn get_all_purchases(&self) -> crate::Result<PurchasesResponse> {
        // Mock implementation for desktop
        Ok(PurchasesResponse { purchases: vec![] })
    }

    pub fn get_subscription(&self, _payload: PurchaseRequest) -> crate::Result<ProductsResponse> {
        // Mock implementation for desktop
        Ok(ProductsResponse { products: vec![] })
    }

    pub fn get_list_subscription(
        &self,
        _payload: SubscriptionListRequest,
    ) -> crate::Result<SubscriptionListResponse> {
        // Mock implementation for desktop
        Ok(SubscriptionListResponse {
            subscriptions: vec![],
        })
    }
}
