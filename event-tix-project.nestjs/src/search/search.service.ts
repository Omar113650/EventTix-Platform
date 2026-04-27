// src/search/search.service.ts
import { Injectable } from '@nestjs/common';
import smartSearch from 'smart-search';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../Event/entities/Event.entities';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async searchEvents(query: string) {
    const events = await this.eventRepo.find();
    const fields = {
      title: true,
      description: true,
      location: true,
    };
    const patterns = [query];
    
    const results = smartSearch(events, patterns, fields);

    return results;
  }
}
