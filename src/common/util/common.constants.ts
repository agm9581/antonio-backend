import { ValidationPipeOptions } from "@nestjs/common";

export const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};

export const DEFAULT_PAGE_SIZE = {
  USER: 10,
  ORDER: 5,
  PAYMENT: 10,
  CATEGORY: 10,
  PRODUCT: 50,
} as const satisfies Record<string, number>;
