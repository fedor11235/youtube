<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h4">Watch History</div>
      <div>
        <q-btn
          flat
          color="primary"
          icon="delete"
          label="Clear History"
          @click="confirmClearHistory"
        />
      </div>
    </div>

    <!-- History Filters -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-input
          v-model="search"
          outlined
          dense
          placeholder="Search watch history"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="timeFilter"
          :options="timeFilterOptions"
          outlined
          dense
          label="Time"
        />
      </div>
    </div>

    <!-- History List -->
    <div class="row q-col-gutter-y-lg">
      <template v-for="(group, date) in groupedHistory" :key="date">
        <div class="col-12">
          <div class="text-subtitle1 q-mb-md">{{ formatGroupDate(date) }}</div>
          
          <div class="row q-col-gutter-md">
            <template v-for="video in group" :key="video.id">
              <div class="col-12">
                <q-card flat bordered class="history-card">
                  <div class="row no-wrap">
                    <div class="col-12 col-sm-4">
                      <q-img
                        :src="video.thumbnailUrl"
                        @click="$router.push(`/watch/${video.id}`)"
                        style="cursor: pointer"
                        :ratio="16/9"
                      >
                        <div class="absolute-bottom text-subtitle2 bg-transparent">
                          <q-badge color="dark" class="q-pa-xs">
                            {{ formatDuration(video.duration) }}
                          </q-badge>
                        </div>
                      </q-img>
                    </div>

                    <div class="col q-pa-md">
                      <div class="row items-start justify-between">
                        <div class="col">
                          <div 
                            class="text-h6 ellipsis-2-lines cursor-pointer" 
                            @click="$router.push(`/watch/${video.id}`)"
                          >
                            {{ video.title }}
                          </div>
                          
                          <div class="row items-center q-mt-sm">
                            <q-avatar size="24px" class="q-mr-sm">
                              <img :src="getAvatar(video.channel.avatar )">
                            </q-avatar>
                            <span class="text-subtitle2">{{ video.channel.name }}</span>
                          </div>

                          <div class="text-grey q-mt-sm">
                            {{ video.views }} views • {{ formatDate(video.createdAt) }}
                          </div>

                          <div class="text-grey q-mt-sm">
                            Watched {{ formatTime(video.watchedAt) }}
                          </div>
                        </div>

                        <div>
                          <q-btn
                            flat
                            round
                            icon="more_vert"
                          >
                            <q-menu>
                              <q-list style="min-width: 150px">
                                <q-item clickable v-close-popup @click="removeFromHistory(video.id)">
                                  <q-item-section avatar>
                                    <q-icon name="delete" />
                                  </q-item-section>
                                  <q-item-section>Remove from history</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="addToWatchLater(video.id)">
                                  <q-item-section avatar>
                                    <q-icon name="watch_later" />
                                  </q-item-section>
                                  <q-item-section>Save to Watch later</q-item-section>
                                </q-item>
                              </q-list>
                            </q-menu>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!Object.keys(groupedHistory).length" class="column items-center q-pa-xl">
      <q-icon name="history" size="64px" color="grey" />
      <div class="text-h6 q-mt-md">No watch history</div>
      <div class="text-grey">Videos you watch will appear here</div>
      <q-btn
        color="primary"
        label="Browse Videos"
        class="q-mt-md"
        @click="$router.push('/')"
      />
    </div>

    <!-- Clear History Dialog -->
    <q-dialog v-model="clearDialog">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Clear Watch History</div>
        </q-card-section>

        <q-card-section>
          Are you sure you want to clear your entire watch history?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Clear" color="negative" @click="clearHistory" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
// import { format } from 'date-fns'
import type { Video } from '../types'
import { getAvatar } from '../utils/avatar'

interface HistoryVideo extends Video {
  watchedAt: Date;
}

const $q = useQuasar()
const search = ref('')
const clearDialog = ref(false)
const timeFilter = ref('all')
const timeFilterOptions = [
  { label: 'All time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'week' },
  { label: 'Last 30 days', value: 'month' }
]

const historyVideos = ref<HistoryVideo[]>([
  {
    id: 1,
    title: 'Sample Video',
    description: 'Sample description',
    thumbnailUrl: 'https://picsum.photos/1920/1080',
    duration: 360,
    views: 1.2,
    createdAt: new Date(),
    watchedAt: new Date(),
    channel: {
      id: 1,
      name: 'Channel Name',
      avatar: '',
      subscribers: 1000
    },
    user: {
      id: 1,
      name: 'Channel Name',
      avatar: '',
      subscribers: 1000
    }
  }
])

const groupedHistory = computed(() => {
  const groups: { [key: string]: HistoryVideo[] } = {}
  
  historyVideos.value.forEach(video => {
    // const date = format(video.watchedAt, 'yyyy-MM-dd')
    const date =  video.watchedAt.toString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(video)
  })
  
  return groups
})

const formatGroupDate = (date: string | number): string => {
  // return format(new Date(date), 'MMMM d, yyyy')
  return date.toString()
}

const formatDate = (date: Date): string => {
  // return date.fromNow()
  return date.toString()
}

const formatTime = (date: Date): string => {
  // return format(date, 'h:mm a')
  return date.toString()
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const removeFromHistory = (videoId: number) => {
  historyVideos.value = historyVideos.value.filter(v => v.id !== videoId)
  $q.notify({
    message: 'Video removed from history',
    color: 'positive'
  })
}

const confirmClearHistory = () => {
  clearDialog.value = true
}

const clearHistory = () => {
  historyVideos.value = []
  $q.notify({
    message: 'Watch history cleared',
    color: 'positive'
  })
}

const addToWatchLater = (videoId: number) => {
  console.log(videoId)
  // Implement watch later functionality
  $q.notify({
    message: 'Added to Watch Later',
    color: 'positive'
  })
}
</script>

<style scoped>
.history-card {
  transition: transform 0.2s;
}

.history-card:hover {
  transform: translateY(-2px);
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>