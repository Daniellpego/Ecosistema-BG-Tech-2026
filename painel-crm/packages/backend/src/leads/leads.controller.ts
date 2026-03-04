import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { enqueueAgentJob } from '../agents/queue';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List all leads for current tenant' })
  @ApiResponse({ status: 200, description: 'List of leads' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'temperature', required: false })
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
    @Query('temperature') temperature?: string,
  ) {
    const data = await this.leadsService.findAll(tenantId, { status, temperature });
    return { data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details by ID' })
  @ApiResponse({ status: 200, description: 'Lead details with agent logs' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.leadsService.findById(tenantId, id);
  }

  @Post(':id/qualify')
  @HttpCode(202)
  @ApiOperation({ summary: 'Enqueue lead qualification job' })
  @ApiResponse({ status: 202, description: 'Qualification job enqueued' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async qualifyLead(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    // Ensure lead exists
    await this.leadsService.findById(tenantId, id);
    return enqueueAgentJob({
      tenantId,
      agentName: 'qualification',
      action: 'qualify_lead',
      payload: { leadId: id },
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update lead status' })
  @ApiResponse({ status: 200, description: 'Lead status updated' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  updateStatus(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.leadsService.updateStatus(tenantId, id, status);
  }
}
