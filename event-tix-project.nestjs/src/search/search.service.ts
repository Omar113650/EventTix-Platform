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
    // 1️⃣ نجيب الداتا من DB
    const events = await this.eventRepo.find();

    // 2️⃣ نحدد الحقول اللي هيتعمل فيها search
    const fields = {
      title: true,
      description: true,
      location: true,
    };

    // 3️⃣ patterns
    const patterns = [query];

    // 4️⃣ البحث الذكي
    const results = smartSearch(events, patterns, fields);

    return results;
  }
}
