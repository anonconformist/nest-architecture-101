
import { Body, Controller, Post, Get, Patch, Delete, Param, Query, NotFoundException, UseInterceptors, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor'; 
import { UserDto } from './dtos/user-dtos';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/create-user.interceptors';
import { User } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)

export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService){

    }

    /// ----------->>>>>>>>>>>>>>>>>>>>>    sessions    <<<<<<<<<<<<<<<--------------------
    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any){
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session: any){
    //     return session.color;`1`
    // }

    // @Get('/whoAmI')
    // whoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId);
    // }

    @Get('/whoAmI')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signOut')
    signOut(@Session() session: any){
        session.userId = null;
    }

    @Post('/signup')
    async signup(@Body() body: CreateUserDto, @Session() session: any){
        // console.log(body)
        // this.userService.create(body.email, body.password);
        const user = await this.authService.signUp(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto,  @Session() session: any){
        const user = await this.authService.signIn(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    // @UseInterceptors(new SerializeInterceptor (UserDto) )
    // @Serialize(UserDto)
    @Get('/:id')
    async findOne(@Param('id') id: string){
        const user = await this.userService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id), body);
    }

}
