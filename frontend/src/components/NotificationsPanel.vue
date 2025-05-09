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
              <q-item clickable v-close-popup @click="emit('mark-all-as-read')">
                <q-item-section>{{ t('notifications.markAllRead') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="emit('clear-all')">
                <q-item-section>{{ t('notifications.clearAll') }}</q-item-section>
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
              @click="event => emit('click', event)"
              @toggle-read="event => emit('toggle-read', event)"
              @remove="event => emit('remove', event)"
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NotificationItem from './NotificationItem.vue'
import type { Notification } from '../types/index'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean;
  notifications: Notification[];
}>()

const emit = defineEmits<{
  (e: 'toggle-read', notification: Notification): void;
  (e: 'remove', id: number): void;
  (e: 'click', notification: Notification): void;
  (e: 'clear-all'): void;
  (e: 'mark-all-as-read'): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>