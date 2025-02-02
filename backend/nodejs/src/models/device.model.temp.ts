import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id?: number; // Marked as optional

  @ManyToOne(() => User, user => user.devices)
  @JoinColumn({ name: 'userId' })
  user?: User; // Marked as optional

  @Column()
  name: string;

  @Column()
  macAddress: string;

  @Column({ nullable: true }) // Made optional
  ipAddress?: string; // Marked as optional

  @Column({ type: 'timestamp', nullable: true })
  lastWake?: Date; // Marked as optional

  @Column({ default: 'unknown' })
  status: 'online' | 'offline' | 'unknown';

  constructor(name: string, macAddress: string) {
    this.name = name;
    this.macAddress = macAddress;
    this.status = 'unknown'; // Default value
  }
}
