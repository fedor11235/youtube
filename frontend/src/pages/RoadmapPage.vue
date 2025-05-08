<template>
  <q-page class="roadmap-page q-pa-md">
    <div class="roadmap-container">
      <h1 class="text-h4 text-center q-mb-lg">План развития платформы</h1>

      <div class="row q-col-gutter-md">
        <!-- Текущий квартал -->
        <div class="col-12 col-md-4">
          <q-card class="roadmap-card">
            <q-card-section>
              <div class="text-h6">Q4 2023</div>
              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="task_alt" color="positive" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">Улучшение системы поиска</div>
                    <div class="text-caption">Расширенные фильтры и категории</div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="pending" color="warning" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">Система комментариев</div>
                    <div class="text-caption">Ветки обсуждений и реакции</div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="grey" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">Личные плейлисты</div>
                    <div class="text-caption">Создание и управление плейлистами</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Следующий квартал -->
        <div class="col-12 col-md-4">
          <q-card class="roadmap-card">
            <q-card-section>
              <div class="text-h6">Q1 2024</div>
              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="grey" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">Мобильное приложение</div>
                    <div class="text-caption">iOS и Android версии</div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="grey" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">Прямые трансляции</div>
                    <div class="text-caption">Стриминг и чат в реальном времени</div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="grey" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">Система достижений</div>
                    <div class="text-caption">Награды за активность</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Долгосрочные планы -->
        <div class="col-12 col-md-4">
          <q-card class="roadmap-card">
            <q-card-section>
              <div class="text-h6">2024+</div>
              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="grey" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">Монетизация для авторов</div>
                    <div class="text-caption">Система донатов и подписок</div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="grey" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">AI-рекомендации</div>
                    <div class="text-caption">Персонализированный контент</div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="grey" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-weight-medium">Образовательная платформа</div>
                    <div class="text-caption">Курсы и обучающие материалы</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="feedback-section q-mt-xl">
        <h2 class="text-h5 text-center q-mb-md">Ваши предложения</h2>
        <p class="text-center q-mb-lg">
          Мы всегда открыты для ваших идей по улучшению платформы
        </p>
        <div class="text-center">
          <q-btn
            color="primary"
            label="Оставить предложение"
            to="/feedback"
            icon="lightbulb"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.roadmap-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.roadmap-container {
  max-width: 1200px;
  margin: 0 auto;
}

.roadmap-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.q-card {
  border-radius: 12px;
}
</style>