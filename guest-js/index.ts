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
}

export async function createPurchaseSubscription(
  productId: string
): Promise<SubscriptionPurchaseResponse | null> {
  return await invoke<Partial<SubscriptionPurchaseResponse>>("plugin:pliap|create_purchase_subscription", {
    payload: {
      productId,
    },
  }).then((r) => r.success ? {
    success: r.success,
    purchaseToken: r.purchaseToken,
    orderId: r.orderId,
    isAutoRenewing: r.isAutoRenewing,
    pending: r.pending,
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

export async function getSubscription(productId: string): Promise<BillingProduct | null> {
  return await invoke<{ products: BillingProduct[] }>(
    "plugin:pliap|get_subscription",
    {
      payload: {
        productId,
      },
    }
  ).then((r) => r.products?.[0] || null);
}

export async function getListSubscription(productIds: string[]): Promise<BillingProduct[]> {
  return await invoke<{ subscriptions: BillingProduct[] }>(
    "plugin:pliap|get_list_subscription",
    {
      payload: {
        productIds,
      },
    }
  ).then((r) => r.subscriptions || []);
}

