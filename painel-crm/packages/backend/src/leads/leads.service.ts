import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, params?: { status?: string; temperature?: string }) {
    return this.prisma.lead.findMany({
      where: {
        tenantId,
        ...(params?.status && { leadStatus: params.status }),
        ...(params?.temperature && { leadTemperature: params.temperature }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: { agentLogs: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!lead) throw new NotFoundException(`Lead ${id} not found`);
    return lead;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
    if (!lead) throw new NotFoundException(`Lead ${id} not found`);
    return this.prisma.lead.update({
      where: { id },
      data: { leadStatus: status },
    });
  }
}
