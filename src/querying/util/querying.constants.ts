
export const MAX_PAGE_SIZE = 100;
export const MAX_PAGE_NUMBER = 25
export const DEFAULT_PAGE_SIZE = {
    USER: 10,
    ORDER: 5,
    PAYMENT: 10,
    CATEGORY: 10,
    PRODUCT: 50,
} as const satisfies Record<string, number>;
