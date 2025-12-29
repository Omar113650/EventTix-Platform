// src/search/search.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Event } from '../Event/entities/Event.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
