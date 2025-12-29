import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../Category/category.service';
import { CategoryController } from '../Category/category.controller';
import { RolesGuard } from '../Auth/roles/roles.guard';
import { AuthModule } from '../Auth/auth.module';
import { EventCategory } from './entities/Category.entities';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([EventCategory]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, RolesGuard],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CategoryController);
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes({
    //     path: '/api/category/add-category',
    //     method: RequestMethod.POST,
    //   }); //   method محدد
  }
}
