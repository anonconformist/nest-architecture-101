
import { Body, Controller, Post, Get, Patch, Delete, Param, Query, NotFoundException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor'; 
import { UserDto } from './dtos/user-dtos';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService){

    }

    @Post('/signup')
    signup(@Body() body: CreateUserDto){
        // console.log(body)
        // this.userService.create(body.email, body.password);
        return this.authService.signUp(body.email, body.password);
    }


    @Post('/signin')
    signin(@Body() body: CreateUserDto){
        return this.authService.signIn(body.email, body.password);
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
