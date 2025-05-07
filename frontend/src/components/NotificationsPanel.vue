<template>
  <q-menu
    v-model="show"
    anchor="bottom right"
    self="top right"
    style="min-width: 350px; max-width: 400px"
  >
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">{{ t('notifications.title') }}</div>
        <q-btn
          flat
          round
          dense
          icon="more_vert"
        >
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup @click="markAllAsRead">
                <q-item-section>{{ t('notifications.markAllRead') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="clearAll">
                <q-item-section>{{ t('notifications.clearAll') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="openSettings">
                <q-item-section>{{ t('notifications.settings') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll" style="max-height: 400px">
        <template v-if="notifications.length">
          <q-list>
            <NotificationItem
              v-for="(notification, index) in notifications"
              :key="notification.id"
              :notification="notification"
              :is-last="index === notifications.length - 1"
              @click="handleNotificationClick"
              @toggle-read="toggleRead"
              @remove="removeNotification"
            />
          </q-list>
        </template>
        <template v-else>
          <div class="text-center q-pa-md">
            <q-icon name="notifications_none" size="48px" color="grey" />
            <div class="text-subtitle1 q-mt-sm">{{ t('notifications.empty') }}</div>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NotificationItem from './NotificationItem.vue'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>()

const router = useRouter()
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notifications = ref<any[]>([
  {
    id: 1,
    title: 'New Video Upload',
    message: 'Channel Name uploaded a new video',
    avatar: '',
    read: false,
    createdAt: String(new Date()),
    link: '/watch/1',
    type: 'video'
  },
  {
    id: 2,
    title: 'New Subscriber',
    message: 'User started following you',
    avatar: '',
    read: true,
    createdAt: String(new Date(Date.now() - 86400000)),
    type: 'subscription'
  }
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleNotificationClick = async (notification: any) => {
  if (!notification.read) {
    toggleRead(notification)
  }
  
  if (notification.link) {
    await router.push(notification.link)
  }
  
  show.value = false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleRead = (notification: any) => {
  notification.read = !notification.read
}

const markAllAsRead = () => {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }))
}

const clearAll = () => {
  notifications.value = []
}

const removeNotification = (id: number) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const openSettings = async () => {
  await router.push('/settings/notifications')
}
</script>