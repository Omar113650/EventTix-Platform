import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsFeaturedToEvent1689435600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'Events',
      new TableColumn({
        name: 'isFeatured',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'Notifications',
      new TableColumn({
        name: 'expiresAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('Events', 'isFeatured');
  }
}

// ج. تشغيل الـ Migration
// npx typeorm migration:run
// ده هيضيف العمود الجديد بدون ما يمس بيانات المستخدمين.

// لو حصل خطأ، تقدر ترجع باستخدام:
// npx typeorm migration:revert

// add column
