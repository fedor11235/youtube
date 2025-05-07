import { drizzle } from 'drizzle-orm/node-postgres';
import { tags, videoTags } from '../schema';
import { pool } from '../index';

const db = drizzle(pool);

const seedTags = async () => {
  try {
    // Создаем базовые теги
    const initialTags = [
      { name: 'Программирование' },
      { name: 'Веб-разработка' },
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'React' },
      { name: 'Vue' },
      { name: 'Node.js' },
      { name: 'Python' },
      { name: 'DevOps' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'Git' },
      { name: 'База данных' },
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'Тестирование' },
      { name: 'CI/CD' },
      { name: 'Архитектура' },
      { name: 'Алгоритмы' },
      { name: 'Безопасность' }
    ];

    console.log('Начало сидинга тегов...');

    // Вставляем теги
    const insertedTags = await db.insert(tags)
      .values(initialTags)
      .returning();

    console.log(`Успешно добавлено ${insertedTags.length} тегов`);

    return insertedTags;
  } catch (error) {
    console.error('Ошибка при сидинге тегов:', error);
    throw error;
  }
};

// Запускаем сидинг
seedTags()
  .then(() => {
    console.log('Сидинг тегов завершен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Ошибка при сидинге:', error);
    process.exit(1);
  });