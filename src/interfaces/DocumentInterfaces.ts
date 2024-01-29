export interface IBigCommerceApiDocument {
    shop_slug: string;
    store_url: string;
    store_hash: string;
    client_id: string;
    access_token: string;
    secret: string;
  }
  
  export interface IBoldDocument {
    shop_slug: string;
    shop_identifier: string;
    access_token: string;
    shop_domain: string;
    platform: string;
    custom_domain: string;
  }
  
  export interface IBoldPluginDocument {
    shop_slug: string;
    plugin_token: string;
    shop_domain: string;
    platform: string;
  }
  
  export interface IBigCommerceTokens {
    shop_slug: string;
    store_hash: string;
    store_url: string;
    client_id: string;
    access_token: string;
    secret: string;
  
  }