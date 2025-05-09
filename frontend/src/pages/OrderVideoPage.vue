<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Заказать видео</div>

    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h5">Форма заказа видео</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <q-input
                v-model="form.title"
                label="Название видео"
                :rules="[val => !!val || 'Обязательное поле']"
                outlined
              />

              <q-input
                v-model="form.description"
                type="textarea"
                label="Описание заказа"
                :rules="[val => !!val || 'Обязательное поле']"
                outlined
              />

              <q-input
                v-model="form.contact"
                type="textarea"
                label="Напишите как с ами можно связаться"
                :rules="[val => !!val || 'Обязательное поле']"
                outlined
              />

              <q-input
                v-model="form.budget"
                type="number"
                label="Бюджет"
                suffix="$"
                :rules="[val => val > 0 || 'Бюджет должен быть больше 0']"
                outlined
              />

              <q-input
                v-model="form.deadline"
                type="date"
                label="Желаемая дата готовности"
                :rules="[val => !!val || 'Обязательное поле']"
                outlined
              />

              <div class="q-mt-lg">
                <q-btn
                  type="submit"
                  color="primary"
                  label="Отправить заказ"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import orderService from '../services/order'

const $q = useQuasar()
const loading = ref(false)

const form = ref({
  title: '',
  description: '',
  budget: 0,
  deadline: '',
  contact: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await orderService.submitOrder(form.value)
    // Здесь будет логика отправки заказа
    $q.notify({
      type: 'positive',
      message: 'Заказ успешно отправлен'
    })
    form.value = {
      title: '',
      description: '',
      budget: 0,
      deadline: '',
      contact: ''
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при отправке заказа'
    })
  } finally {
    loading.value = false
  }
}
</script>