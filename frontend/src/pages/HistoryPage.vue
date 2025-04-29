<template>
  <div class="history-page q-pa-md">
    <div class="header-section q-mb-lg">
      <h2 class="text-h4">История просмотров</h2>
      <q-btn
        v-if="history.length"
        color="negative"
        flat
        label="Очистить историю"
        @click="confirmClearHistory"
      />
    </div>

    <div v-if="history.length" class="history-list">
      <div v-for="entry in history" :key="entry.id" class="history-item q-mb-md">
        <q-card flat bordered class="cursor-pointer" @click="navigateToVideo(entry.video.id)">
          <div class="row no-wrap">
            <q-img
              :src="entry.video.thumbnail"
              :ratio="16/9"
              class="col-4"
            />
            <q-card-section class="col">
              <div class="text-h6 ellipsis-2-lines">{{ entry.video.title }}</div>
              <div class="text-subtitle2">
                {{ entry.video.user.username }}
              </div>
              <div class="text-caption text-grey">
                {{ entry.video.views }} просмотров
                <span class="q-mx-sm">•</span>
                Просмотрено {{ formatDate(entry.watchedAt) }}
              </div>
            </q-card-section>
          </div>
        </q-card>
      </div>
    </div>

    <div v-else class="text-center q-mt-xl">
      <q-icon name="history" size="48px" color="grey-6" />
      <div class="text-h6 q-mt-md">История просмотров пуста</div>
    </div>

    <q-dialog v-model="clearConfirmDialog">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Очистить историю просмотров?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn flat label="Очистить" color="negative" @click="clearHistory" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { videoHistoryService } from 'src/services/video-history';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const history: any = ref([]);
const clearConfirmDialog = ref(false);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU');
};

const navigateToVideo = async (videoId: number) => {
  await router.push(`/watch/${videoId}`);
};

const loadHistory = async () => {
  try {
    history.value = await videoHistoryService.getHistory();
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Не удалось загрузить историю просмотров'
    });
  }
};

const confirmClearHistory = () => {
  clearConfirmDialog.value = true;
};

const clearHistory = async () => {
  try {
    await videoHistoryService.clearHistory();
    history.value = [];
    $q.notify({
      type: 'positive',
      message: 'История просмотров очищена'
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Не удалось очистить историю просмотров'
    });
  }
};

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  loadHistory();
});
</script>

<style scoped>
.history-page {
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>