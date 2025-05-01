<template>
  <q-page class="feedback-page q-pa-md">
    <div class="feedback-container">
      <h1 class="text-h4 text-center q-mb-lg">Обратная связь</h1>

      <q-card class="feedback-form">
        <q-card-section>
          <div class="text-body1 q-mb-md">
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
              v-model="feedback.message"
              type="textarea"
              label="Сообщение"
              outlined
              autogrow
              :rules="[val => !!val || 'Пожалуйста, напишите сообщение']"
            />

            <q-file
              v-model="feedback.attachments"
              label="Прикрепить файлы"
              outlined
              multiple
              accept=".jpg,.png,.pdf"
              max-files="3"
              max-file-size="5242880"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div class="row justify-end q-mt-md">
              <q-btn
                label="Отправить"
                type="submit"
                color="primary"
                :loading="submitting"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <q-dialog v-model="showSuccessDialog">
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="check_circle" color="positive" text-color="white" />
            <span class="q-ml-sm">Спасибо за обратную связь!</span>
          </q-card-section>
          <q-card-section>
            Мы получили ваше сообщение и ответим вам в ближайшее время.
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Закрыть" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

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
  message: '',
  attachments: null
})

const submitting = ref(false)
const showSuccessDialog = ref(false)

const onSubmit = async () => {
  try {
    submitting.value = true
    // Здесь будет логика отправки формы на бэкенд
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccessDialog.value = true
    feedback.value = {
      subject: '',
      type: null,
      message: '',
      attachments: null
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Произошла ошибка при отправке формы'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
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