<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">{{ t('auth.register') }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.username"
                :label="t('auth.username')"
                outlined
                :rules="[val => !!val || t('auth.usernameRequired')]"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.username"
                :label="t('auth.username')"
                outlined
                :rules="[val => !!val || t('auth.usernameRequired')]"
              />
            </div>
          </div>

          <q-input
            v-model="form.email"
            :label="t('auth.email')"
            type="email"
            outlined
            class="q-mt-md"
            :rules="[
              val => !!val || t('auth.emailRequired'),
              val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || t('auth.emailInvalid')
            ]"
          />

          <q-input
            v-model="form.password"
            :label="t('auth.password')"
            type="password"
            outlined
            class="q-mt-md"
            :rules="[
              val => !!val || t('auth.passwordRequired'),
              val => val.length >= 6 || t('auth.passwordMinLength')
            ]"
          />

          <q-input
            v-model="confirmPassword"
            :label="t('auth.confirmPassword')"
            type="password"
            outlined
            class="q-mt-md"
            :rules="[
              val => !!val || t('auth.confirmPasswordRequired'),
              val => val === form.password || t('auth.passwordsDoNotMatch')
            ]"
          />

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              :label="t('auth.register')"
              class="full-width"
              :loading="authStore.loading"
            />
          </div>

          <div class="text-center q-mt-sm">
            {{ t('auth.haveAccount') }}
            <router-link to="/login">{{ t('auth.login') }}</router-link>
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
import type { RegisterData } from '../types/auth'
import type { ApiError } from '../types/error'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const $q = useQuasar()

const form = ref<RegisterData>({
  email: '',
  username: '',
  password: '',
})

const confirmPassword = ref('')

const handleSubmit = async () => {
  try {
    await authStore.register(form.value)
    $q.notify({
      type: 'positive',
      message: t('auth.registerSuccess')
    })
    await router.push('/')
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: (err as ApiError).response?.data?.message || t('auth.registerFailed')
    })
  }
}
</script>