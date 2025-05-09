<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h5">{{ t('video.upload.title') }}</div>
          </q-card-section>
          <q-separator />

          <q-card-section>
            <div v-show="!selectedVideo" class="upload-area q-pa-xl">
              <q-file
                v-model="videoFile"
                accept="video/*"
                @update:model-value="handleVideoSelect"
                style="display: none"
                ref="fileInput"
              />
              
              <div class="text-center cursor-pointer" @click="triggerFileInput">
                <q-icon name="cloud_upload" size="48px" color="grey" />
                <div class="text-h6 q-mt-sm">{{ t('video.upload.dragDrop') }}</div>
                <div class="text-grey">{{ t('video.upload.orClick') }}</div>
                <q-btn
                  color="primary"
                  :label="t('video.upload.selectFiles')"
                  class="q-mt-md"
                />
              </div>
            </div>

            <div v-show="selectedVideo">
              <video
                ref="videoPreview"
                class="full-width"
                style="max-height: 400px"
                controls
              />

              <div class="text-h6 q-mt-lg">Теги</div>
              <q-select
                v-model="selectedTags"
                outlined
                multiple
                use-chips
                use-input
                input-debounce="0"
                class="q-mt-sm"
                label="Выберите теги для видео"
                :options="availableTags"
              >
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    dense
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    color="primary"
                    text-color="white"
                  >
                    {{ scope.opt }}
                  </q-chip>
                </template>
              </q-select>


              <q-form @submit="handleUpload" class="q-mt-lg">
                <q-input
                  v-model="videoDetails.title"
                  label="Title"
                  outlined
                  :rules="[val => !!val || 'Title is required']"
                />

                <q-input
                  v-model="videoDetails.description"
                  label="Description"
                  type="textarea"
                  outlined
                  class="q-mt-md"
                  autogrow
                />

                <q-file
                  v-model="thumbnailFile"
                  label="Custom Thumbnail"
                  outlined
                  accept=".jpg,.png,.jpeg"
                  class="q-mt-md"
                >
                  <template v-slot:prepend>
                    <q-icon name="image" />
                  </template>
                </q-file>

                <div class="row justify-between q-mt-lg">
                  <q-btn
                    flat
                    color="grey"
                    label="Cancel"
                    @click="resetForm"
                  />
                  <q-btn
                    color="primary"
                    label="Upload"
                    type="submit"
                    :loading="uploading"
                  />
                </div>
              </q-form>
            </div>
          </q-card-section>
        </q-card>

        <q-dialog v-model="uploadProgress.show">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Uploading Video</div>
            </q-card-section>

            <q-card-section>
              <q-linear-progress
                :value="uploadProgress.value"
                color="primary"
                class="q-mt-md"
              />
              <div class="text-center q-mt-sm">
                {{ Math.round(uploadProgress.value * 100) }}%
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
// import type { VideoUpload } from 'src/types/video'
import videoService from 'src/services/video'
import type { VideoUpload } from 'src/types/video'

const { t } = useI18n()
const router = useRouter()
const $q = useQuasar()

interface Test extends HTMLInputElement {
  pickFiles: () => void
}

const fileInput = ref<Test | null>(null)
const videoPreview = ref<HTMLVideoElement | null>(null)
const videoFile = ref<File | null>(null)
const thumbnailFile = ref<File | null>(null)
const selectedVideo = ref<boolean>(false)
const uploading = ref<boolean>(false)
const selectedTags = ref<string[]>([]);
const availableTags = ref<string[]>([]);

const uploadProgress = ref({
  show: false,
  value: 0
})

interface VideoDetails {
  title: string;
  description: string;
}

const videoDetails = ref<VideoDetails>({
  title: '',
  description: ''
})

const triggerFileInput = () => {
  fileInput.value?.pickFiles()
}

const handleVideoSelect = (file: File) => {
  if (!file) return
  
  selectedVideo.value = true
  videoFile.value = file

  if (videoPreview.value) {
    videoPreview.value.src = URL.createObjectURL(file)
  }
}

const resetForm = () => {
  selectedVideo.value = false
  videoFile.value = null
  thumbnailFile.value = null
  videoDetails.value = {
    title: '',
    description: ''
  }
  if (videoPreview.value) {
    videoPreview.value.src = ''
  }
}

const handleUpload = async () => {
  try{
  if (!videoFile.value) return

  uploading.value = true
  uploadProgress.value.show = true

    const uploadData: VideoUpload = {
      title: videoDetails.value.title,
      description: videoDetails.value.description,
      videoFile: videoFile.value
    }

    const video = await videoService.uploadVideo(uploadData)

    if (selectedTags.value.length > 0) {
      await videoService.addVideoTags(video.id, selectedTags.value);
    }

    await updateThumbnail(video.id)

    $q.notify({
      type: 'positive',
      message: t('video.upload.success')
    })

    await router.push('/')
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: t('video.upload.error')
    })
  } finally {
    uploading.value = false
    uploadProgress.value.show = false
    uploadProgress.value.value = 0
    resetForm()
  }
}

const updateThumbnail = async (videoId: number) => {
  if (!thumbnailFile.value) return
  try {
    await videoService.updateThumbnail(videoId, thumbnailFile.value)
    $q.notify({
      type: 'positive',
      message: 'Миниатюра успешно обновлена'
    })
  } catch (err) {
    console.error('Error updating banner:', err)
    $q.notify({
      type: 'negative',
      message: 'Не удалось обновить миниатюру'
    })
  }
}

onMounted(async () => {
  try {
    const tags = await videoService.getTags();
    availableTags.value = tags.map(tag => tag.name);
  } catch (error) {
    console.error('Ошибка при загрузке тегов:', error);
  }
});
</script>

<style lang="scss" scoped>
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    border-color: #1976d2;
    background: #f0f8ff;
  }
}
</style>