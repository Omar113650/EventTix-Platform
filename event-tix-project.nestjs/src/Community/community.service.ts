import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Like,
  Repository,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
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
    // await this.communityRepository.find({
    //   relations: {
    //     users: true,
    //     events: true,
    //   },
    // });

    return await this.communityRepository.save(community);
  }

  async getCommunities(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    communities: Community[];
    total: number;
    page: number;
    limit: number;
  }> {
    const filterOptions: any = {};
    if (params?.search) filterOptions.name = Like(`%${params.search}%`);

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    this.communityRepository.find({
      relations: ['user', 'event'],
    });

    // where: { user: { id: userId } },
    // relations: ["event"]   // لو عايز تجيب معه الأحداث

    const [communities, total] = await this.communityRepository.findAndCount({
      where: filterOptions,
      skip,
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

// ✔ preload يستخدم لما تكون مش جايب entity قبلها

// ✔ طالما جايبه بـ findOne → عدل و save
