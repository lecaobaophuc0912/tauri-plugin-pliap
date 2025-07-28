import { invoke } from '@tauri-apps/api/core'

type BillingProduct = {
  description: string;
  name: string;
  productId: string;
  productType: string;
  title: string;
  price: string;
};

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

type BasePlan = {
  basePlanId: string;
  name: string;
  price: string;
  billingPeriod: string;
  isDefault?: boolean;
};

type SubscriptionProduct = {
  description: string;
  name: string;
  productId: string;
  productType: string;
  title: string;
  price: string;
  basePlans?: BasePlan[];
};

export async function ping(value: string): Promise<string | null> {
  return await invoke<{ value?: string }>('plugin:pliap|ping', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

export async function create_purchase(value: string): Promise<string | null> {
  return await invoke<{ value?: string }>('plugin:pliap|create_purchase', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

export async function createPurchase(
  productId: string
): Promise<boolean | null> {
  return await invoke<{ success?: boolean }>("plugin:pliap|create_purchase", {
    payload: {
      productId,
    },
  }).then((r) => r.success || null);
}

export interface SubscriptionPurchaseResponse {
  success: boolean;
  purchaseToken?: string;
  orderId?: string;
  isAutoRenewing?: boolean;
  pending?: boolean;
  basePlanId?: string;
  offerToken?: string;
  productId?: string;
  price?: string;
}

export interface SubscriptionPurchaseOptions {
  productId: string;
  basePlanId?: string;
  offerToken?: string;
}

export async function createPurchaseSubscription(
  options: SubscriptionPurchaseOptions | string
): Promise<SubscriptionPurchaseResponse | null> {
  const payload = typeof options === 'string'
    ? { productId: options }
    : {
      productId: options.productId,
      basePlanId: options.basePlanId,
      offerToken: options.offerToken,
    };

  return await invoke<Partial<SubscriptionPurchaseResponse>>("plugin:pliap|create_purchase_subscription", {
    payload,
  }).then((r) => r.success ? {
    success: r.success,
    purchaseToken: r.purchaseToken,
    orderId: r.orderId,
    isAutoRenewing: r.isAutoRenewing,
    pending: r.pending,
    basePlanId: r.basePlanId,
    offerToken: r.offerToken,
    productId: r.productId,
    price: r.price,
  } : null);
}

export async function consume(
  purchaseToken: string
): Promise<boolean | null> {
  return await invoke<{ success?: boolean }>("plugin:pliap|consume", {
    payload: {
      purchaseToken,
    },
  }).then((r) => r.success || null);
}

export async function getProduct(
  productId: string
): Promise<BillingProduct | null> {
  return await invoke<{ products: BillingProduct[] }>(
    "plugin:pliap|get_product",
    {
      payload: {
        productId,
      },
    }
  ).then((r) => r.products?.[0] || null);
}

export async function getAllPurchases(): Promise<BillingPurchase[]> {
  return await invoke<{ purchases: BillingPurchase[] }>(
    "plugin:pliap|get_all_purchases"
  ).then((r) => r.purchases || []);
}

export async function getSubscription(productId: string): Promise<SubscriptionProduct | null> {
  return await invoke<{ subscriptions: SubscriptionProduct[] }>(
    "plugin:pliap|get_subscription",
    {
      payload: {
        productId,
      },
    }
  ).then((r) => r.subscriptions?.[0] || null);
}

export async function getListSubscription(productIds: string[]): Promise<SubscriptionProduct[]> {
  return await invoke<{ subscriptions: SubscriptionProduct[] }>(
    "plugin:pliap|get_list_subscription",
    {
      payload: {
        productIds,
      },
    }
  ).then((r) => r.subscriptions || []);
}

