import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Community } from './entities/community.entities';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { UpdateDtoCommunity } from './dto/updateCommunity.dto';
import { Event } from '../Event/entities/Event.entities';
import { AddCommentDTO } from './dto/AddComment.dto';
import { AddCommunityFeedbackDto } from './dto/AddFeedback.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(Event)
    private readonly EventRepository: Repository<Event>,
  ) {}

  async createCommunity(dto: CreateCommunityDto): Promise<Community> {
    const { eventId, userId } = dto;
    const community = this.communityRepository.create({
      ...dto,
      users: [{ id: userId }],
      events: [{ id: eventId }],
    });
    return await this.communityRepository.save(community);
  }

  async getCommunities(params?: {
    page?: number;
    limit?: number;
    search?: string;
    userId?: string;
  }): Promise<{
    communities: Community[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, userId } = params || {};

    const where: any = {};
    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [communities, total] = await this.communityRepository.findAndCount({
      // ternary operator
      where: userId ? { users: { id: userId } } : {},
      relations: ['users', 'events'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { communities, total, page, limit };
  }

  async getCommunityById(id: string): Promise<Community> {
    const community = await this.communityRepository.findOne({ where: { id } });
    if (!community) throw new NotFoundException('Community not found');
    return community;
  }

  async updateCommunity(
    id: string,
    dto: UpdateDtoCommunity,
  ): Promise<Community> {
    const community = await this.communityRepository.preload({ id, ...dto });
    if (!community) throw new NotFoundException('Community not found');
    return await this.communityRepository.save(community);
  }

  async deleteCommunity(id: string): Promise<{ message: string }> {
    const community = await this.communityRepository.findOne({ where: { id } });
    if (!community) throw new NotFoundException('Community not found');
    await this.communityRepository.remove(community);
    return { message: 'Community deleted successfully' };
  }

  async addCommentInEvent(dto: AddCommentDTO, id: string) {
    const event = await this.EventRepository.findOne({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException('event not found');
    }
    event.comment = dto.comment;
    await this.EventRepository.save(event);

    return {
      message: 'Comment added successfully',
      event,
    };
  }

  async addFeedbackThisCommunity(dto: AddCommunityFeedbackDto, id: string) {
    const community = await this.communityRepository.findOne({
      where: { id },
    });

    if (!community) {
      throw new NotFoundException('community not found');
    }

    community.feedbackThisCommunity = dto.feedbackThisCommunity;

    await this.communityRepository.save(community);

    return {
      message: 'Feedback added successfully',
      community,
    };
  }
}
