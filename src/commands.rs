use tauri::{command, AppHandle, Runtime};

use crate::models::*;
use crate::PliapExt;
use crate::Result;

#[command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.pliap().ping(payload)
}

#[command]
pub(crate) async fn create_purchase<R: Runtime>(
    app: AppHandle<R>,
    payload: PurchaseRequest,
) -> Result<PurchaseResponse> {
    app.pliap().create_purchase(payload)
}

#[command]
pub(crate) async fn create_purchase_subscription<R: Runtime>(
    app: AppHandle<R>,
    payload: PurchaseRequest,
) -> Result<SubscriptionPurchaseResponse> {
    app.pliap().create_purchase_subscription(payload)
}

#[command]
pub(crate) async fn consume<R: Runtime>(
    app: AppHandle<R>,
    payload: ConsumeRequest,
) -> Result<PurchaseResponse> {
    app.pliap().consume(payload)
}

#[command]
pub(crate) async fn get_product<R: Runtime>(
    app: AppHandle<R>,
    payload: PurchaseRequest,
) -> Result<ProductsResponse> {
    app.pliap().get_product(payload)
}

#[command]
pub(crate) async fn get_all_purchases<R: Runtime>(app: AppHandle<R>) -> Result<PurchasesResponse> {
    app.pliap().get_all_purchases()
}

#[command]
pub(crate) async fn get_subscription<R: Runtime>(
    app: AppHandle<R>,
    payload: PurchaseRequest,
) -> Result<ProductsResponse> {
    app.pliap().get_subscription(payload)
}

#[command]
pub(crate) async fn get_list_subscription<R: Runtime>(
    app: AppHandle<R>,
    payload: SubscriptionListRequest,
) -> Result<SubscriptionListResponse> {
    app.pliap().get_list_subscription(payload)
}
