export const planAccessMap: Record<string, string[] | { allow: string[], deny?: string[] }> = {
  "free trial": [
    "/admin-menu-list", "/order-list", "/barcode", "/order-details/*",
    "/create-resto", "/restaurant", "/add-edit-dish", "/bill/*", "/main", "/admin-profile"
  ],
  "basic": [
    "/admin-menu-list", "/order-list", "/barcode", "/order-details/*", "/user-management",
    "/create-resto", "/restaurant", "/add-edit-dish", "/bill/*", "/add-coupon", "main", "/admin-profile"
  ],
  "pro": [
    "/admin-menu-list", "/order-list", "/barcode", "/order-details/*",
    "/create-resto", "/restaurant", "/add-edit-dish", "/bill/*", "/user-management",
    "/add-coupon", "/customer-list", "/inventory", "/dashboard", "/main", "/tables", "/admin-profile"
  ],
  "standard": {
    allow: ["*"],
    deny: ["/admin"] // 🚫 explicitly deny /admin
  }
};
