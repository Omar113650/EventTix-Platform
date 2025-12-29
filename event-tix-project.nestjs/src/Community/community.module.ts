import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityService } from '../Community/community.service';
import { CommunityController } from '../Community/community.controller';
import { RolesGuard } from '../Auth/roles/roles.guard';
import { AuthModule } from '../Auth/auth.module';
import { Community } from './entities/community.entities';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import{EventModule} from '../Event/event.module'

@Module({
  imports: [TypeOrmModule.forFeature([Community,Event]), AuthModule,EventModule],
  controllers: [CommunityController],
  providers: [CommunityService, RolesGuard],
})
export class CommunityModule{}
//  implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(AuthMiddleware).forRoutes(CommunityController);
//   }
// }
//
