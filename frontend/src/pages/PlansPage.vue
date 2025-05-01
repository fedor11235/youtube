<template>
  <q-page class="plans-page q-pa-md">
    <div class="plans-container">
      <h1 class="text-h4 text-center q-mb-lg">Планы подписки</h1>
      
      <div class="row q-col-gutter-md justify-center">
        <!-- Бесплатный план -->
        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="plan-card">
            <q-card-section class="text-center">
              <div class="text-h5">Бесплатный</div>
              <div class="text-h4 q-mt-md">
                0 ₽
                <span class="text-subtitle2">/месяц</span>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Базовый доступ к контенту</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Стандартное качество видео</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Реклама в видео</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-actions align="center" class="q-mt-md">
              <q-btn
                color="primary"
                label="Текущий план"
                disabled
                v-if="currentPlan === 'free'"
              />
              <q-btn
                color="primary"
                label="Выбрать"
                outline
                v-else
                @click="selectPlan('free')"
              />
            </q-card-actions>
          </q-card>
        </div>

        <!-- Премиум план -->
        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="plan-card premium-card">
            <q-card-section class="text-center">
              <div class="text-h5">Премиум</div>
              <div class="text-h4 q-mt-md">
                299 ₽
                <span class="text-subtitle2">/месяц</span>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Без рекламы</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>4K качество видео</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Фоновое воспроизведение</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Эксклюзивный контент</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-actions align="center" class="q-mt-md">
              <q-btn
                color="primary"
                label="Текущий план"
                disabled
                v-if="currentPlan === 'premium'"
              />
              <q-btn
                color="primary"
                label="Выбрать"
                @click="selectPlan('premium')"
                v-else
              />
            </q-card-actions>
          </q-card>
        </div>

        <!-- Бизнес план -->
        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="plan-card">
            <q-card-section class="text-center">
              <div class="text-h5">Бизнес</div>
              <div class="text-h4 q-mt-md">
                999 ₽
                <span class="text-subtitle2">/месяц</span>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Все преимущества Премиум</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Брендирование канала</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Аналитика просмотров</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="check" color="positive" />
                  </q-item-section>
                  <q-item-section>Приоритетная поддержка</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-actions align="center" class="q-mt-md">
              <q-btn
                color="primary"
                label="Текущий план"
                disabled
                v-if="currentPlan === 'business'"
              />
              <q-btn
                color="primary"
                label="Выбрать"
                outline
                @click="selectPlan('business')"
                v-else
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Диалог подтверждения -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="shopping_cart" color="primary" text-color="white" />
          <span class="q-ml-sm">Подтверждение выбора плана</span>
        </q-card-section>

        <q-card-section>
          Вы уверены, что хотите выбрать план {{ selectedPlan }}?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn flat label="Подтвердить" color="primary" @click="confirmPlanSelection" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const currentPlan = ref('free')
const selectedPlan = ref('')
const confirmDialog = ref(false)

const selectPlan = (plan: string) => {
  selectedPlan.value = plan
  confirmDialog.value = true
}

const confirmPlanSelection = async () => {
  try {
    // Здесь будет логика изменения плана
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentPlan.value = selectedPlan.value
    confirmDialog.value = false
    $q.notify({
      type: 'positive',
      message: 'План успешно изменен'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Произошла ошибка при изменении плана'
    })
  }
}
</script>

<style scoped>
.plans-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.plans-container {
  max-width: 1200px;
  margin: 0 auto;
}

.plan-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.premium-card {
  border: 2px solid var(--q-primary);
}

.q-card {
  border-radius: 12px;
}
</style>