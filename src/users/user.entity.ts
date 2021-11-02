import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Photo } from "../photos/photo.entity";
import { Token } from "./token.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 50,type: 'varchar'})
    name: string

    @Column({length: 100,type: 'varchar',unique: true})
    email: string

    @Column({type: 'int'})
    age: number

    @Column({type: 'varchar'})
    password: string

    @OneToMany(() => Photo,photo => photo.user)
    photos: Photo[]

    @OneToMany(() => Token,token => token.token)
    tokens: Token[]
}