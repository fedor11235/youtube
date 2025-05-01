<template>
  <div>
    <q-btn
      flat
      round
      icon="share"
      @click="showShareDialog = true"
    >
      <q-tooltip>Поделиться</q-tooltip>
    </q-btn>

    <q-dialog v-model="showShareDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Поделиться видео</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Ссылка на видео:</div>
          <q-input
            v-model="shareLink"
            readonly
            outlined
            dense
            class="q-mb-md"
          >
            <template v-slot:after>
              <q-btn
                flat
                dense
                icon="content_copy"
                @click="copyLink"
              >
                <q-tooltip>Копировать ссылку</q-tooltip>
              </q-btn>
            </template>
          </q-input>

          <div class="text-subtitle2 q-mb-sm">Поделиться в соцсетях:</div>
          <div class="row q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="send"
              type="a"
              :href="telegramShareLink"
              target="_blank"
            >
              <q-tooltip>Telegram</q-tooltip>
            </q-btn>
            
            <q-btn
              flat
              round
              color="primary"
              icon="public"
              type="a"
              :href="vkShareLink"
              target="_blank"
            >
              <q-tooltip>VKontakte</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              color="primary"
              icon="chat"
              type="a"
              :href="whatsappShareLink"
              target="_blank"
            >
              <q-tooltip>WhatsApp</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps<{
  videoId: number
  title: string
}>()

const $q = useQuasar()
const showShareDialog = ref(false)
const shareLink = computed(() => `${window.location.origin}/watch/${props.videoId}`)

const telegramShareLink = computed(() => 
  `https://t.me/share/url?url=${encodeURIComponent(shareLink.value)}&text=${encodeURIComponent(props.title)}`
)

const vkShareLink = computed(() => 
  `https://vk.com/share.php?url=${encodeURIComponent(shareLink.value)}&title=${encodeURIComponent(props.title)}`
)

const whatsappShareLink = computed(() => 
  `https://api.whatsapp.com/send?text=${encodeURIComponent(props.title + ' ' + shareLink.value)}`
)

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    $q.notify({
      type: 'positive',
      message: 'Ссылка скопирована в буфер обмена',
      position: 'top'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Не удалось скопировать ссылку',
      position: 'top'
    })
  }
}
</script>