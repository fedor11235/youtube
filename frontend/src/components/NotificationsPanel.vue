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
            <template v-for="notification in notifications" :key="notification.id">
              <q-item
                clickable
                :class="{ 'bg-grey-2': !notification.read }"
                @click="handleNotificationClick(notification)"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="getAvatar(notification.avatar)">
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ notification.title }}</q-item-label>
                  <q-item-label caption>{{ notification.message }}</q-item-label>
                  <q-item-label caption>{{ formatDate(notification.createdAt) }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    round
                    dense
                    icon="more_vert"
                    @click.stop
                  >
                    <q-menu>
                      <q-list>
                        <q-item clickable v-close-popup @click="toggleRead(notification)">
                          <q-item-section>
                            {{ notification.read ? t('notifications.markAsUnread') : t('notifications.markAsRead') }}
                          </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="removeNotification(notification.id)">
                          <q-item-section>{{ t('notifications.remove') }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-separator v-if="!isLastNotification(notification)" />
            </template>
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
import { getAvatar } from '../utils/avatar'
// import { date } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Notification {
  id: number;
  title: string;
  message: string;
  avatar: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  type: 'video' | 'subscription' | 'comment' | 'system';
}

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

const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'New Video Upload',
    message: 'Channel Name uploaded a new video',
    avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
    read: false,
    createdAt: new Date(),
    link: '/watch/1',
    type: 'video'
  },
  {
    id: 2,
    title: 'New Subscriber',
    message: 'User started following you',
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    read: true,
    createdAt: new Date(Date.now() - 86400000),
    type: 'subscription'
  }
])

const formatDate = (date: Date): string => {
  // return date.fromNow()
  return date.toString()
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.read) {
    toggleRead(notification)
  }
  
  if (notification.link) {
    await router.push(notification.link)
  }
  
  show.value = false
}

const toggleRead = (notification: Notification) => {
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

const isLastNotification = (notification: Notification): boolean => {
  console.log(notification)
  return false
}

const openSettings = async () => {
  await router.push('/settings/notifications')
}
</script>