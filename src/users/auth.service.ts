import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    constructor(private userService: UsersService){

    }

    async signUp( email: string, password: string){
        //check if email is use
        const users = await this.userService.find(email);
        if(users.length){
            throw new BadRequestException('email already in use');
        }

        //password hashing
        //generate a salt 
        const salt = randomBytes(8).toString('hex');
        //hash the password and salt together
        const hash = ( await scrypt(password, salt, 32) ) as Buffer;
        //join the hashed res and salt
        const result = salt + '.' + hash.toString('hex');
        //create a new user
        const user = await this.userService.create(email, result);
        //return result
        return user;
    }

    async signIn( email: string, password: string){
        //check if email is use
        const [user] = await this.userService.find(email);
        if(!user){
            throw new NotFoundException('user not found');
        }

        //get hash and salt form DB
        const [salt, storedHash] = user.password.split('.');
        //hash the incoming pwd
        const hash = ( await scrypt(password, salt, 32) ) as Buffer;
        //compare hashes
        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('wrong password');
        }
        return user;
    }
}