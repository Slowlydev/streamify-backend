import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base-entity';

export class MetadataEntity extends BaseEntity {
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', default: null })
	updatedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;
}
