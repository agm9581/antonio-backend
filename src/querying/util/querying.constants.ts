
export const DEFAULT_PAGE_SIZE = {
    USER: 10,
    ORDER: 5,
    PAYMENT: 10,
    CATEGORY: 10,
    PRODUCT: 50,
} as const satisfies Record<string, number>;
