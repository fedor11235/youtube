<template>
  <q-btn
    :color="isSubscribed ? 'grey' : 'primary'"
    :label="isSubscribed ? 'Вы подписаны' : 'Подписаться'"
    :icon="isSubscribed ? 'done' : 'add'"
    @click="toggleSubscription"
    :loading="loading"
    :disable="curentChannelURL === channelUrl"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { subscriptionService } from 'src/services/subscription';

const props = defineProps<{
  channelUrl: string;
  subscribersCount: number;
}>();

const emit = defineEmits<{
  (e: 'update:subscribersCount', count: number): void;
}>();

const authStore = useAuthStore();
const $q = useQuasar();
const isSubscribed = ref(false);
const loading = ref(false);
const curentChannelURL = computed(() => authStore.channel?.url);

const toggleSubscription = async () => {
  if (!authStore.isAuthenticated) {
    $q.notify({
      type: 'warning',
      message: 'Войдите, чтобы подписаться на канал'
    });
    return;
  }

  try {
    loading.value = true;
    if (isSubscribed.value) {
      await subscriptionService.unsubscribe(props.channelUrl);
      emit('update:subscribersCount', props.subscribersCount - 1);
    } else {
      await subscriptionService.subscribe(props.channelUrl);
      emit('update:subscribersCount', props.subscribersCount + 1);
    }
    isSubscribed.value = !isSubscribed.value;
    
    $q.notify({
      type: 'positive',
      message: isSubscribed.value ? 'Вы подписались на канал' : 'Вы отписались от канала'
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Произошла ошибка при изменении подписки'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      isSubscribed.value = await subscriptionService.checkSubscription(props.channelUrl);
    } catch (error) {
      console.error('Ошибка при проверке подписки:', error);
    }
  }
});
</script>