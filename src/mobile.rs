use serde::de::DeserializeOwned;
use tauri::{
    plugin::{PluginApi, PluginHandle},
    AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_pliap);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    _app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<Pliap<R>> {
    #[cfg(target_os = "android")]
    let handle = api.register_android_plugin("com.plugin.pliap", "BillingPlugin")?;
    #[cfg(target_os = "ios")]
    let handle = api.register_ios_plugin(init_plugin_pliap)?;
    Ok(Pliap(handle))
}

/// Access to the pliap APIs.
pub struct Pliap<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> Pliap<R> {
    pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
        self.0
            .run_mobile_plugin("ping", payload)
            .map_err(Into::into)
    }

    pub fn create_purchase(&self, payload: PurchaseRequest) -> crate::Result<PurchaseResponse> {
        self.0
            .run_mobile_plugin("createPurchase", payload)
            .map_err(Into::into)
    }

    pub fn create_purchase_subscription(
        &self,
        payload: PurchaseRequest,
    ) -> crate::Result<SubscriptionPurchaseResponse> {
        self.0
            .run_mobile_plugin("createPurchaseSubscription", payload)
            .map_err(Into::into)
    }

    pub fn consume(&self, payload: ConsumeRequest) -> crate::Result<PurchaseResponse> {
        self.0
            .run_mobile_plugin("consume", payload)
            .map_err(Into::into)
    }

    pub fn get_product(&self, payload: PurchaseRequest) -> crate::Result<ProductsResponse> {
        self.0
            .run_mobile_plugin("getProduct", payload)
            .map_err(Into::into)
    }

    pub fn get_all_purchases(&self) -> crate::Result<PurchasesResponse> {
        self.0
            .run_mobile_plugin("getAllPurchases", 0)
            .map_err(Into::into)
    }

    pub fn get_subscription(&self, payload: PurchaseRequest) -> crate::Result<ProductsResponse> {
        self.0
            .run_mobile_plugin("getSubscriptionProduct", payload)
            .map_err(Into::into)
    }

    pub fn get_list_subscription(
        &self,
        payload: SubscriptionListRequest,
    ) -> crate::Result<SubscriptionListResponse> {
        self.0
            .run_mobile_plugin("getListSubscription", payload)
            .map_err(Into::into)
    }
}
