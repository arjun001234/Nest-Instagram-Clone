import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity() 
export class Photo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar',length: 200})
    photo: string

    @Column({type: 'varchar',nullable: true})
    caption: string

    @Column({type: "varchar"})
    filename: string

    @ManyToOne(() => User,user => user.photos)
    user: User
}