import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert(){
        console.log(`inserted user with id: ${this.id}`)
    }

    @AfterRemove()
    logRecover(){
        console.log(`removed user with id: ${this.id}`)
    }

    @AfterUpdate()
    logUdate(){
        console.log(`updated user with id: ${this.id}`)
    }
}