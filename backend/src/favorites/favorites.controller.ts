import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  findAll(@Req() req): Observable<number[]> {
    return this.favoritesService.findSalonIds(req.user.id);
  }

  @Post(':salonId')
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  add(@Param('salonId', ParseIntPipe) salonId: number, @Req() req): Observable<{ salonId: number }> {
    return this.favoritesService.add(req.user.id, salonId);
  }

  @Delete(':salonId')
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  remove(@Param('salonId', ParseIntPipe) salonId: number, @Req() req): Observable<{ salonId: number }> {
    return this.favoritesService.remove(req.user.id, salonId);
  }
}