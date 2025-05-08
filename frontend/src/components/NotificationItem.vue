<template>
  <div>
    <q-item
      clickable
      :class="{ 'bg-grey-5': !notification.read }"
      @click="$emit('click', notification)"
    >
      <q-item-section avatar>
        <q-avatar>
          <img :src="getAvatar(notification?.data?.channel?.avatar)">
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
              <q-item clickable v-close-popup @click="$emit('toggle-read', notification)">
                <q-item-section>
                  {{ notification.read ? t('notifications.markAsUnread') : t('notifications.markAsRead') }}
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('remove', notification.id)">
                <q-item-section>{{ t('notifications.remove') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-item-section>
    </q-item>
    <q-separator v-if="!isLast" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { date } from 'quasar';
import { getAvatar } from '../utils/avatar'

const { t } = useI18n();

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notification: any;
  isLast: boolean;
}>();

defineEmits<{
  (e: 'click', notification: Notification): void;
  (e: 'toggle-read', notification: Notification): void;
  (e: 'remove', id: number): void;
}>();

const formatDate = (dateString: string) => {
  return date.formatDate(dateString, 'DD.MM.YYYY HH:mm');
};
</script>