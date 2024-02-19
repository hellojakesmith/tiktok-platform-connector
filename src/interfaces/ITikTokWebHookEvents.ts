//src/interfaces/ITikTokWebHookEvents.ts

export interface WebhookEventData {
    shop_id: string;
    timestamp: number;
  }
  
  export interface OrderStatusChangeData extends WebhookEventData {
    order_id: string;
    order_status: string;
    is_on_hold_order: boolean;
    update_time: number;
  }
  
  export interface CancellationStatusChangeData extends WebhookEventData {
    order_id: string;
    cancellations_role: 'BUYER' | 'SELLER' | 'SYSTEM';
    cancel_status: string;
    cancel_id: string;
    create_time: number;
  }
  
  export interface ReturnStatusChangeData extends WebhookEventData {
    order_id: string;
    return_role: 'BUYER' | 'SELLER' | 'SYSTEM';
    return_type: 'REFUND' | 'RETURN_AND_REFUND';
    return_status: string;
    return_id: string;
    create_time: number;
    update_time: number;
  }
  
  export interface RecipientAddressUpdateData extends WebhookEventData {
    order_id: string;
    update_time: number;
  }
  
  export interface PackageUpdateData extends WebhookEventData {
    sc_type: string;
    role_type: 'ROLE_USER' | 'ROLE_SELLER' | 'ROLE_OPERATOR' | 'ROLE_SYSTEM';
    package_list: Array<{
      package_id: string;
      order_id_list: string[];
    }>;
    update_time: number;
  }
  
  export interface ProductStatusChangeData extends WebhookEventData {
    product_id: string;
    status: string;
    suspended_reason: string;
    update_time: number;
  }
  
  export interface SellerDeauthorizationData extends WebhookEventData {
    message: string;
  }
  
  export interface UpcomingAuthorizationExpirationData extends WebhookEventData {
    message: string;
    expiration_time: string;
  }
  