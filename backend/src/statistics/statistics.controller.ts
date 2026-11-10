import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { OwnerStats } from './dto/owner-stats.dto';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('owner')
  @Roles('owner')
  @UseGuards(RolesGuard)
  ownerStats(@Req() req): Observable<OwnerStats> {
    return this.statisticsService.ownerStats(req.user.id);
  }
}