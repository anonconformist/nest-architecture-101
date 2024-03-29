import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){

    }

    create(email: string, password: string) {
        const user = this.repo.create({email, password}); //creates an instance of an entity 
        return this.repo.save(user); //actual persistence
    }

    findOne(id: number) {
        if(!id){
            throw new NotFoundException('user signed out');
        }
        return this.repo.findOneBy({ id });
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }
    
    async update(id: number, attrs: Partial<User>){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('user not found');
        }
        return this.repo.remove(user);
    }
}
