import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS
  app.enableCors({
    origin: [
      'https://ree-site.onrender.com',
      'http://localhost',
      'http://localhost:80',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
