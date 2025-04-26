<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Профиль пользователя -->
      <div class="col-12 col-md-3">
        <q-card class="user-profile">
          <q-card-section class="text-center">
            <q-avatar size="150px">
              <img :src="getAvatar(user?.avatar )" />
            </q-avatar>
            <h5 class="q-mt-md q-mb-xs">{{ user?.firstName }} {{ user?.lastName }}</h5>
            <p class="text-grey">{{ user?.country }}, {{ user?.city }}</p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Контент пользователя -->
      <div class="col-12 col-md-9">
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="videos" label="Видео" />
          <q-tab name="about" label="О пользователе" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="videos">
            <div class="row q-col-gutter-md">
              <!-- Здесь будет список видео -->
            </div>
          </q-tab-panel>

          <q-tab-panel name="about">
            <div class="text-h6">О пользователе</div>
            <p>Дата регистрации: {{ formatDate(user?.createdAt || '') }}</p>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { getAvatar } from '../utils/avatar'
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { date } from 'quasar'
import { useUserStore } from '../stores/user'


interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  country: string
  city: string
  avatar?: string
  createdAt: string
}

const route = useRoute()
const userStore = useUserStore()
const tab = ref('videos')
const user: Ref<User | null> = ref(null)

onMounted(async () => {
  const userId = route.params.id
  try {
    if(typeof userId === 'string') {
      user.value = await userStore.fetchUserById(userId)
    }
    console.log("user.value: ", user.value)
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error)
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return date.formatDate(dateString, 'DD.MM.YYYY')
}
</script>