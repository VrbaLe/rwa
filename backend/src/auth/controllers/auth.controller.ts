import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from '../dto/auth.dto';
import { AuthService } from '../auth.service';
import { LocalGuard } from '../guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthPayloadDtoRegister } from '../dto/auth-pay-load.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { catchError, map, Observable, of } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { CreateOwnerDto } from 'src/owner/dto/create-owner.dto';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    @UseGuards(LocalGuard)
    login(@Req() req: Request&{ user: any }){
        return req.user;
    }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    status(@Req() req: Request & { user: any }){
        return req.user;
    }

    @Post('registerUser')
    registerUser(@Body() userData: CreateUserDto): Observable<{ success: boolean; data?: any; message?: string }> {
        return this.authService.registerUser(userData).pipe(
            map(result => ({ success: true, data: result })),
            catchError(error => of({ success: false, message: error.message })),
        );
    }

    @Post('registerOwner')
    registerOwner(@Body() ownerData: CreateOwnerDto): Observable<{ success: boolean; data?: any; message?: string }> {
        return this.authService.registerOwner(ownerData).pipe(
            map(result => ({ success: true, data: result })),
            catchError(error => of({ success: false, message: error.message })),
        );
    }

    @Put('changePassword/:id')
    @UseGuards(RolesGuard)
    changePassword(
        @Param('id') user_id: number,
        @Body() data: { oldPassword: string; newPassword: string }
    ): Observable<{ message: string }> {
        return this.authService.changePassword(user_id, data.oldPassword, data.newPassword);
    }
}
