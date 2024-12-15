import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.use(helmet())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


/** UUID
 * Virtually 100% unique
 * 2^128
 * 
 * + Avoid database id collision
 * + Cannot guess an id
 * 
 * -Occupies more space
 * 
 */