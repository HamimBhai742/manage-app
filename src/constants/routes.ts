export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  ORDERS: "/orders",
  PROFILE: "/profile",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: {
    HOME: "/dashboard",
    PROFILE: "/dashboard/profile",
    USERS: "/dashboard/users",
    PRODUCTS: "/dashboard/products",
    PRODUCT_LINKS: (id: string) => `/dashboard/products/${id}/links`,
    ORDERS: "/dashboard/orders",
    SETTINGS: "/dashboard/settings",
  },
} as const;

export type RoutesType = typeof ROUTES;
