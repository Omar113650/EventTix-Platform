import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEventV21689435600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Events_v2',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                    { name: 'title', type: 'varchar', length: '50' },
                    { name: 'description', type: 'text', isNullable: true },
                    { name: 'location', type: 'varchar', length: '100' },
                    { name: 'startAt', type: 'timestamp' },
                    { name: 'endAt', type: 'timestamp' },
                    { name: 'capacity', type: 'int' },
                    { name: 'price', type: 'decimal', precision: 10, scale: 2, isNullable: true },
                    { name: 'isFeatured', type: 'boolean', default: false },
                    { name: 'createdAt', type: 'timestamp', default: 'now()' },
                    { name: 'updatedAt', type: 'timestamp', default: 'now()' },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Events_v2');
    }
}




// add a new table