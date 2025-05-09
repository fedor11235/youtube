<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="age-verification-dialog">
      <q-card-section class="text-center q-pt-lg">
        <div class="text-h6">Подтверждение возраста</div>
        <div class="text-subtitle1 q-mt-md">
          Для доступа к контенту необходимо подтвердить, что вам исполнилось 18 лет
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pa-md">
        <q-btn
          color="primary"
          label="Мне исполнилось 18 лет"
          @click="confirmAge"
        />
        <q-btn
          flat
          color="grey"
          label="Мне нет 18 лет"
          @click="rejectAge"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const showDialog = ref(false)
const authStore = useAuthStore();

const checkAgeVerification = () => {
  const isVerified = sessionStorage.getItem('ageVerified')
  console.log("isVerified: ", isVerified)
  console.log(authStore.isAuthenticated)
  if (!isVerified && !authStore.isAuthenticated) {
    showDialog.value = true
  }
}

const confirmAge = () => {
  sessionStorage.setItem('ageVerified', 'true')
  showDialog.value = false
}

const rejectAge = () => {
  $q.notify({
    type: 'negative',
    message: 'Доступ запрещен. Вам должно быть 18 лет для просмотра контента.'
  })
}


onMounted(() => {
  checkAgeVerification()
})
</script>

<style lang="scss" scoped>
.age-verification-dialog {
  min-width: 300px;
  padding: 20px;
}
</style>