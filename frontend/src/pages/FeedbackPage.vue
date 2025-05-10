<template>
  <q-page class="feedback-page q-pa-md">
    <div class="feedback-container">
      <h1 class="text-h4 text-center q-mb-lg">Обратная связь</h1>

      <q-card class="feedback-form">
        <q-card-section>
          <div class="text-body1 q-mb-lg">
            Мы ценим ваше мнение и стремимся сделать наш сервис лучше. Пожалуйста, поделитесь своими мыслями или сообщите о проблеме.
          </div>

          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="feedback.subject"
              label="Тема"
              outlined
              :rules="[val => !!val || 'Пожалуйста, укажите тему']"
            />

            <q-select
              v-model="feedback.type"
              :options="feedbackTypes"
              label="Тип обращения"
              outlined
              :rules="[val => !!val || 'Выберите тип обращения']"
            />

            <q-input
              v-model="feedback.contact"
              type="textarea"
              label="Напишите как с ами можно связаться"
              :rules="[val => !!val || 'Обязательное поле']"
              outlined
            />

            <q-input
              v-model="feedback.message"
              type="textarea"
              label="Сообщение"
              outlined
              autogrow
              :rules="[val => !!val || 'Пожалуйста, напишите сообщение']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                label="Отправить"
                type="submit"
                color="primary"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import feedbackService from '../services/feedback'

const $q = useQuasar()

const feedbackTypes = [
  'Предложение по улучшению',
  'Сообщение об ошибке',
  'Вопрос',
  'Другое'
]

const feedback = ref({
  subject: '',
  type: null,
  contact: '',
  message: '',
})

const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  try {
    await feedbackService.submitFeedback(feedback.value)

    $q.notify({
      type: 'positive',
      message: 'Ваш отзыв отправлен'
    })

    feedback.value = {
      subject: '',
      type: null,
      contact: '',
      message: ''
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Произошла ошибка при отправке формы'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.feedback-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.feedback-container {
  max-width: 800px;
  margin: 0 auto;
}

.feedback-form {
  background: white;
  border-radius: 12px;
}
</style>
