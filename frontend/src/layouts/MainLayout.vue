<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        
        <q-toolbar-title class="row items-center">
          <q-img src="../assets/logo.png" width="120px" />
        </q-toolbar-title>

        <q-space />

        <q-btn-dropdown flat>
          <template v-slot:label>
            <q-icon name="language" />
          </template>
          
          <q-list>
            <q-item clickable v-close-popup @click="changeLanguage('en')">
              <q-item-section>English</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage('ru')">
              <q-item-section>Русский</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <template v-if="authStore.isAuthenticated">
          <q-btn round flat icon="video_call" class="q-mr-sm" to="/upload" />
        </template>
        
        <q-btn
          round
          flat
          icon="notifications"
          class="q-mr-sm"
          :class="{ 'text-red': hasUnreadNotifications }"
        >
          <q-badge
            v-if="unreadCount"
            color="red"
            floating
          >
            {{ unreadCount }}
          </q-badge>
          <NotificationsPanel v-model="showNotifications" />
        </q-btn>
        
        <template v-if="authStore.isAuthenticated">
          <q-btn-dropdown flat>
            <template v-slot:label>
              <q-avatar size="26px">
                <img :src="getAvatar(authStore?.user?.avatar)">
              </q-avatar>
              <span class="q-ml-sm">{{ authStore.userFullName }}</span>
            </template>

            <q-list>
              <q-item clickable v-close-popup to="/profile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>{{ t('common.profile') }}</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>{{ t('common.logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>

        <template v-else>
          <q-btn flat label="Login" to="/login" />
          <q-btn flat label="Register" to="/register" />
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>{{ t('navigation.home') }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/trending">
          <q-item-section avatar>
            <q-icon name="whatshot" />
          </q-item-section>
          <q-item-section>{{ t('navigation.trending') }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/search">
          <q-item-section avatar>
            <q-icon name="manage_search" />
          </q-item-section>
          <q-item-section>Поиск аккаунтов</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/feedback">
          <q-item-section avatar>
            <q-icon name="feedback" />
          </q-item-section>
          <q-item-section>{{ 'feedback' }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/roadmap">
          <q-item-section avatar>
            <q-icon name="timeline" />
          </q-item-section>
          <q-item-section>План развития</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/order-video"
        >
          <q-item-section avatar>
            <q-icon name="request_quote" />
          </q-item-section>
          <q-item-section>
            Заказать видео
          </q-item-section>
        </q-item>

        <!-- <q-item clickable v-ripple to="/plans">
          <q-item-section avatar>
            <q-icon name="workspace_premium" />
          </q-item-section>
          <q-item-section>Планы подписки</q-item-section>
        </q-item> -->

        <template v-if="authStore.isAuthenticated">
          <q-separator />

          <q-item clickable v-ripple to="/subscriptions">
            <q-item-section avatar>
              <q-icon name="subscriptions" />
            </q-item-section>
            <q-item-section>{{ t('navigation.subscriptions') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/library">
            <q-item-section avatar>
              <q-icon name="video_library" />
            </q-item-section>
            <q-item-section>{{ t('navigation.library') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/history">
            <q-item-section avatar>
              <q-icon name="history" />
            </q-item-section>
            <q-item-section>{{ t('navigation.history') }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { getAvatar } from '../utils/avatar'
import NotificationsPanel from '../components/NotificationsPanel.vue'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const { locale, t } = useI18n()

const changeLanguage = (lang: string) => {
  locale.value = lang
}

const showNotifications = ref(false)
const hasUnreadNotifications = computed(() => unreadCount.value > 0)
const unreadCount = ref(1) // Replace with actual unread count from your state management

const leftDrawerOpen = ref<boolean>(false)

const toggleLeftDrawer = (): void => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/login')
}
</script>