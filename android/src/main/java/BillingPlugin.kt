package com.plugin.pliap

import android.app.Activity
import android.webkit.WebView
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.JSArray
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke
import com.android.billingclient.api.*

@InvokeArg
class PurchaseArgs {
    var productId: String? = null
}

@InvokeArg
class ConsumeArgs {
    var purchaseToken: String? = null
}

@InvokeArg
class SubscriptionListArgs {
    var productIds: List<String>? = null
}

@InvokeArg
class SubscriptionPurchaseArgs {
    var productId: String? = null
    var basePlanId: String? = null
    var offerToken: String? = null
}

@InvokeArg
class PingArgs {
  var value: String? = null
}

fun getBillingMessage(billingResult: BillingResult): String {
    return when (billingResult.responseCode) {
        -3 -> "SERVICE_TIMEOUT"
        -2 -> "FEATURE_NOT_SUPPORTED"
        -1 -> "SERVICE_DISCONNECTED"
        0 -> "OK"
        1 -> "USER_CANCELED"
        2 -> "SERVICE_UNAVAILABLE"
        3 -> "BILLING_UNAVAILABLE"
        4 -> "ITEM_UNAVAILABLE"
        5 -> "DEVELOPER_ERROR"
        6 -> "ERROR"
        7 -> "ITEM_ALREADY_OWNED"
        8 -> "ITEM_NOT_OWNED"
        12 -> "NETWORK_ERROR"
        else -> "UNKNOWN_ERROR"
    }
}

fun getProductQueryParams(productId: String): QueryProductDetailsParams {
    return QueryProductDetailsParams.newBuilder()
    .setProductList(
        listOf(
            QueryProductDetailsParams.Product.newBuilder()
            .setProductId(productId)
            .setProductType(BillingClient.ProductType.INAPP)
            .build()
        )
    )
    .build()
}

// Thêm hàm hỗ trợ query subscription product details
fun getSubscriptionQueryParams(productId: String): QueryProductDetailsParams {
    return QueryProductDetailsParams.newBuilder()
        .setProductList(
            listOf(
                QueryProductDetailsParams.Product.newBuilder()
                    .setProductId(productId)
                    .setProductType(BillingClient.ProductType.SUBS)
                    .build()
            )
        )
        .build()
}

@TauriPlugin
class BillingPlugin(private val activity: Activity) : Plugin(activity) {
    private lateinit var billingClient: BillingClient
    private var savedInvoke: Invoke? = null
    private val implementation = Example()

    override fun load(webView: WebView) {
        initializeBillingClient()
    }

     @Command
    fun ping(invoke: Invoke) {
        val args = invoke.parseArgs(PingArgs::class.java)

        val ret = JSObject()
        ret.put("value", implementation.pong(args.value ?: "default value :("))
        invoke.resolve(ret)
    }

    private fun initializeBillingClient() {
        billingClient = BillingClient.newBuilder(activity)
            .setListener { billingResult, purchases ->
                // Handle purchase updates here
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && purchases != null) {
                    println("Handling purchase..")
                    val purchase = purchases[0]
                    
                    // Check if this is a subscription purchase
                    if (purchase.products.any { productId ->
                        // You might want to maintain a list of subscription product IDs
                        // or check the product type from the purchase
                        productId.contains("subscription") || productId.contains("subs")
                    }) {
                        handlePurchaseSubscription(purchase)
                    } else {
                        handlePurchase(purchase)
                    }
                } else {
                    savedInvoke?.reject("billingResult: " + getBillingMessage(billingResult))
                }
            }
            .enablePendingPurchases()
            .build()

        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    // Billing client is ready
                }
            }

            override fun onBillingServiceDisconnected() {
                // Try to restart the connection
            }
        })
    }

    private fun handlePurchase(purchase: Purchase) {
        // Handle the purchase (e.g., validate and acknowledge it)
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            if (!purchase.isAcknowledged) {
                val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(purchase.purchaseToken)
                .build()
                
                billingClient.acknowledgePurchase(acknowledgePurchaseParams) { billingResult ->
                    if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                        val ret = JSObject()
                        ret.put("success", true)
                        savedInvoke?.resolve(ret)
                    } else {
                        savedInvoke?.reject("acknowledgePurchase: " + getBillingMessage(billingResult))
                    }
                }
            } else {
                val ret = JSObject()
                ret.put("success", true)
                savedInvoke?.resolve(ret)
            }
        } else {
            savedInvoke?.reject("purchaseState: " + purchase.purchaseState)
        }
    }

    @Command
    fun createPurchase(invoke: Invoke) {
        // Reject previous saved if it exists
        savedInvoke?.reject("New request requested")
        savedInvoke = invoke

        val args = invoke.parseArgs(PurchaseArgs::class.java)
        val queryParams = getProductQueryParams(args.productId ?: "")

        billingClient.queryProductDetailsAsync(queryParams) { billingResult, productDetailsList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && productDetailsList.isNotEmpty()) {
                val dets = productDetailsList[0]
                val billingFlowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(
                        listOf(
                            BillingFlowParams.ProductDetailsParams.newBuilder()
                                .setProductDetails(dets)
                                .build()
                        )
                    )
                    .build()

                val billingResult = billingClient.launchBillingFlow(activity, billingFlowParams)
                if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
                    invoke.reject("launchBillingFlow: " + getBillingMessage(billingResult))
                }

                return@queryProductDetailsAsync
            } else {
                invoke.reject("queryProductDetailsAsync: " + getBillingMessage(billingResult))
            }
        }
    }

    @Command
    fun createPurchaseSubscription(invoke: Invoke) {
        // Reject previous saved if it exists
        savedInvoke?.reject("New subscription request requested")
        savedInvoke = invoke

        val args = invoke.parseArgs(SubscriptionPurchaseArgs::class.java)
        val queryParams = getSubscriptionQueryParams(args.productId ?: "")

        billingClient.queryProductDetailsAsync(queryParams) { billingResult, productDetailsList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && productDetailsList.isNotEmpty()) {
                val dets = productDetailsList[0]
                
                // Find the appropriate offer token based on basePlanId
                val offerToken = if (args.basePlanId != null) {
                    // Look for the specific base plan
                    dets.subscriptionOfferDetails?.find { offerDetail ->
                        offerDetail.basePlanId == args.basePlanId
                    }?.offerToken
                } else {
                    // Use the first available offer (default behavior)
                    dets.subscriptionOfferDetails?.get(0)?.offerToken
                }
                
                if (offerToken == null) {
                    val errorMsg = if (args.basePlanId != null) {
                        "Base plan '${args.basePlanId}' not found for product '${args.productId}'"
                    } else {
                        "No subscription offer available for product '${args.productId}'"
                    }
                    invoke.reject(errorMsg)
                    return@queryProductDetailsAsync
                }

                val billingFlowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(
                        listOf(
                            BillingFlowParams.ProductDetailsParams.newBuilder()
                                .setProductDetails(dets)
                                .setOfferToken(offerToken)
                                .build()
                        )
                    )
                    .build()

                val billingResult = billingClient.launchBillingFlow(activity, billingFlowParams)
                if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
                    invoke.reject("launchBillingFlow: " + getBillingMessage(billingResult))
                }

                return@queryProductDetailsAsync
            } else {
                invoke.reject("queryProductDetailsAsync: " + getBillingMessage(billingResult))
            }
        }
    }

    private fun handlePurchaseSubscription(purchase: Purchase) {
        // Handle the subscription purchase (e.g., validate and acknowledge it)
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            if (!purchase.isAcknowledged) {
                val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(purchase.purchaseToken)
                .build()
                
                billingClient.acknowledgePurchase(acknowledgePurchaseParams) { billingResult ->
                    if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                        val ret = JSObject()
                        ret.put("success", true)
                        ret.put("purchaseToken", purchase.purchaseToken)
                        ret.put("orderId", purchase.orderId)
                        ret.put("isAutoRenewing", purchase.isAutoRenewing)
                        savedInvoke?.resolve(ret)
                    } else {
                        savedInvoke?.reject("acknowledgePurchase: " + getBillingMessage(billingResult))
                    }
                }
            } else {
                val ret = JSObject()
                ret.put("success", true)
                ret.put("purchaseToken", purchase.purchaseToken)
                ret.put("orderId", purchase.orderId)
                ret.put("isAutoRenewing", purchase.isAutoRenewing)
                savedInvoke?.resolve(ret)
            }
        } else if (purchase.purchaseState == Purchase.PurchaseState.PENDING) {
            // Subscription is pending (e.g., waiting for payment confirmation)
            val ret = JSObject()
            ret.put("success", true)
            ret.put("purchaseToken", purchase.purchaseToken)
            ret.put("orderId", purchase.orderId)
            ret.put("isAutoRenewing", purchase.isAutoRenewing)
            ret.put("pending", true)
            savedInvoke?.resolve(ret)
        } else {
            savedInvoke?.reject("purchaseState: " + purchase.purchaseState)
        }
    }

    @Command
    fun getProduct(invoke: Invoke) {
        val args = invoke.parseArgs(PurchaseArgs::class.java)
        val queryParams = getProductQueryParams(args.productId ?: "")

        billingClient.queryProductDetailsAsync(queryParams) { billingResult, productDetailsList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && productDetailsList.isNotEmpty()) {
                val ret = JSObject()
                val productsArray = JSArray()

                productDetailsList.forEach { dets ->
                    val productObj = JSObject().apply {
                        put("description", dets.description)
                        put("name", dets.name)
                        put("productId", dets.productId)
                        put("productType", dets.productType)
                        put("title", dets.title)
                        put("price", dets.oneTimePurchaseOfferDetails?.formattedPrice)
                    }

                    productsArray.put(productObj)
                }
                
                ret.put("products", productsArray)
                invoke.resolve(ret)
                return@queryProductDetailsAsync
            } else {
                invoke.reject("queryProductDetailsAsync: " + getBillingMessage(billingResult))
            }
        }
    }

    @Command
    fun getAllPurchases(invoke: Invoke) {
        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.INAPP)
            .build()

        billingClient.queryPurchasesAsync(params) { billingResult, purchasesList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && purchasesList.isNotEmpty()) {
                val ret = JSObject()
                val purchasesArray = JSArray()

                purchasesList.forEach { dets ->
                    val productsArray = JSArray()
                    dets.products.forEach { prod -> productsArray.put(prod) }

                    val purchase = JSObject().apply {
                        put("orderId", dets.orderId)
                        put("products", productsArray)
                        put("purchaseTime", dets.purchaseTime)
                        put("purchaseToken", dets.purchaseToken)
                        put("purchaseState", dets.purchaseState)
                        put("developerPayload", dets.developerPayload)
                        put("originalJson", dets.originalJson)
                        put("packageName", dets.packageName)
                        put("quantity", dets.quantity)
                        put("signature", dets.signature)
                        put("isAcknowledged", dets.isAcknowledged)
                        put("isAutoRenewing", dets.isAutoRenewing)
                    }

                    purchasesArray.put(purchase)
                }

                ret.put("purchases", purchasesArray)
                invoke.resolve(ret)
            } else {
                invoke.reject("queryPurchasesAsync: " + getBillingMessage(billingResult))
            }
        }
    }

    @Command
    fun getListSubscription(invoke: Invoke) {
        val args = invoke.parseArgs(SubscriptionListArgs::class.java)
        val productIds = args.productIds ?: listOf()
        
        val queryParams = QueryProductDetailsParams.newBuilder()
            .setProductList(
                productIds.map { productId ->
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.SUBS)
                        .build()
                }
            )
            .build()

        billingClient.queryProductDetailsAsync(queryParams) { billingResult, productDetailsList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && productDetailsList.isNotEmpty()) {
                val ret = JSObject()
                val productsArray = JSArray()

                productDetailsList.forEach { dets ->
                    val productObj = JSObject().apply {
                        put("description", dets.description)
                        put("name", dets.name)
                        put("productId", dets.productId)
                        put("productType", dets.productType)
                        put("title", dets.title)
                        put("price", dets.subscriptionOfferDetails?.get(0)?.pricingPhases?.pricingPhaseList?.get(0)?.formattedPrice)
                        
                        // Add base plans information
                        val basePlansArray = JSArray()
                        dets.subscriptionOfferDetails?.forEach { offerDetail ->
                            val basePlanObj = JSObject().apply {
                                put("basePlanId", offerDetail.basePlanId)
                                put("name", offerDetail.basePlanId) // You might want to map this to a display name
                                put("price", offerDetail.pricingPhases.pricingPhaseList[0].formattedPrice)
                                put("billingPeriod", offerDetail.pricingPhases.pricingPhaseList[0].billingPeriod)
                                put("isDefault", offerDetail.basePlanId == dets.subscriptionOfferDetails?.get(0)?.basePlanId)
                            }
                            basePlansArray.put(basePlanObj)
                        }
                        put("basePlans", basePlansArray)
                    }
                    productsArray.put(productObj)
                }

                ret.put("subscriptions", productsArray)
                invoke.resolve(ret)
            } else {
                invoke.reject("queryProductDetailsAsync: " + getBillingMessage(billingResult))
            }
        }
    }

    @Command
    fun getSubscriptionProduct(invoke: Invoke) {
        val args = invoke.parseArgs(PurchaseArgs::class.java)
        val queryParams = getSubscriptionQueryParams(args.productId ?: "")

        billingClient.queryProductDetailsAsync(queryParams) { billingResult, productDetailsList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && productDetailsList.isNotEmpty()) {
                val ret = JSObject()
                val productsArray = JSArray()

                productDetailsList.forEach { dets ->
                    val productObj = JSObject().apply {
                        put("description", dets.description)
                        put("name", dets.name)
                        put("productId", dets.productId)
                        put("productType", dets.productType)
                        put("title", dets.title)
                        put("price", dets.subscriptionOfferDetails?.get(0)?.pricingPhases?.pricingPhaseList?.get(0)?.formattedPrice)
                        
                        // Add base plans information
                        val basePlansArray = JSArray()
                        dets.subscriptionOfferDetails?.forEach { offerDetail ->
                            val basePlanObj = JSObject().apply {
                                put("basePlanId", offerDetail.basePlanId)
                                put("name", offerDetail.basePlanId) // You might want to map this to a display name
                                put("price", offerDetail.pricingPhases.pricingPhaseList[0].formattedPrice)
                                put("billingPeriod", offerDetail.pricingPhases.pricingPhaseList[0].billingPeriod)
                                put("isDefault", offerDetail.basePlanId == dets.subscriptionOfferDetails?.get(0)?.basePlanId)
                            }
                            basePlansArray.put(basePlanObj)
                        }
                        put("basePlans", basePlansArray)
                    }
                    productsArray.put(productObj)
                }

                ret.put("subscriptions", productsArray)
                invoke.resolve(ret)
            } else {
                invoke.reject("queryProductDetailsAsync: " + getBillingMessage(billingResult))
            }
        }
    }

    @Command
    fun consume(invoke: Invoke) {
        val args = invoke.parseArgs(ConsumeArgs::class.java)
        val consumeParams = ConsumeParams.newBuilder()
            .setPurchaseToken(args.purchaseToken ?: "")
            .build()

        billingClient.consumeAsync(consumeParams) { billingResult, purchasesList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                val ret = JSObject()
                ret.put("success", true)
                invoke.resolve(ret)
            } else {
                invoke.reject("consumeAsync: " + getBillingMessage(billingResult))
            }
        }
    }
}