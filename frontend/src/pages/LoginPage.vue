<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">{{ t('auth.login') }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-input
            v-model="form.email"
            :label="t('auth.email')"
            type="email"
            outlined
            :rules="[val => !!val || t('auth.emailRequired')]"
          />

          <q-input
            v-model="form.password"
            :label="t('auth.password')"
            type="password"
            outlined
            class="q-mt-md"
            :rules="[val => !!val || t('auth.passwordRequired')]"
          />

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              :label="t('auth.login')"
              class="full-width"
              :loading="authStore.loading"
            />
          </div>

          <div class="text-center q-mt-sm">
            {{ t('auth.noAccount') }}
            <router-link to="/register">{{ t('auth.register') }}</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'
import type { ApiError } from '../types/error'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const $q = useQuasar()

const form = ref({
  email: '',
  password: ''
})
const handleSubmit = async () => {
  try {
    await authStore.login(form.value)
    await router.push('/')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: (error as ApiError).response?.data?.message || t('auth.loginFailed')
    })
  }
}
</script>