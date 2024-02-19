// src/constants/WebhookEvents.ts

export enum WebhookEventType {
    ORDER_STATUS_CHANGE = 1,
    CANCELLATION_STATUS_CHANGE = 11,
    RETURN_STATUS_CHANGE = 12,
    RECIPIENT_ADDRESS_UPDATE = 3,
    PACKAGE_UPDATE = 4,
    PRODUCT_STATUS_CHANGE = 5,
    SELLER_DEAUTHORIZATION = 6,
    UPCOMING_AUTHORIZATION_EXPIRATION = 7,
}

// Extend to include detailed descriptions or further data handling specifics
export const WebhookEventDetails = {
    [WebhookEventType.ORDER_STATUS_CHANGE]: {
        description: "Triggered on each order status update.",
    },
    [WebhookEventType.CANCELLATION_STATUS_CHANGE]: {
        description: "Triggered when cancel order status changes.",
    },
    [WebhookEventType.RETURN_STATUS_CHANGE]: {
        description: "Triggered when the return order status changes.",
    },
    [WebhookEventType.RECIPIENT_ADDRESS_UPDATE]: {
        description: "Triggered when receiver address is updated.",
    },
    [WebhookEventType.PACKAGE_UPDATE]: {
        description: "Triggered when the package is updated (combined, split, address updated, etc.).",
    },
    [WebhookEventType.PRODUCT_STATUS_CHANGE]: {
        description: "Triggered when product audit results are updated or product status changes.",
    },
    [WebhookEventType.SELLER_DEAUTHORIZATION]: {
        description: "Triggered after a seller is deauthorized.",
    },
    [WebhookEventType.UPCOMING_AUTHORIZATION_EXPIRATION]: {
        description: "Triggered 30 days before the authorization automatically expires.",
    },
};

