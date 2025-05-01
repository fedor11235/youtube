<template>
  <div class="comment-section q-mt-lg">
    <h2 class="text-h6">Комментарии ({{ comments.length }})</h2>

    <div v-if="authStore.isAuthenticated" class="comment-form q-mt-md">
      <q-input
        ref="commentInput"
        v-model="newComment"
        type="textarea"
        label="Добавить комментарий"
        class="custom-textarea"
        :input-style="{ minHeight: '80px', maxHeight: '80px', lineHeight: '1.5' }"
        :bg-color="$q.dark.isActive ? 'dark' : 'grey-2'"
        outlined
        dense
        counter
        maxlength="1000"
        @keyup.enter.ctrl="submitComment"
      >
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="send"
            color="primary"
            :disable="!newComment.trim()"
            @click="submitComment"
          >
            <q-tooltip>Отправить (Ctrl + Enter)</q-tooltip>
          </q-btn>
        </template>
      </q-input>
    </div>

    <div class="comments-list q-mt-lg">
      <q-list>
        <VideoComment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :video-author-id="videoAuthorId"
          @update="updateComment"
          @delete="confirmDelete"
        />
      </q-list>
    </div>

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <span>Удалить комментарий?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn flat label="Удалить" color="negative" @click="deleteComment" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { commentService, type Comment } from 'src/services/comment';
import VideoComment from './VideoComment.vue'

const props = defineProps<{
  videoId: number;
  videoAuthorId: number;
}>();

const $q = useQuasar();
const authStore = useAuthStore();
const comments = ref<Comment[]>([]);
const newComment = ref('');
const editingComment = ref<{ id: number; content: string } | null>(null);
const deleteDialog = ref(false);
const commentToDelete = ref<Comment | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commentInput = ref<any>(null);

const loadComments = async () => {
  try {
    comments.value = await commentService.getVideoComments(props.videoId);
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при загрузке комментариев'
    });
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Комментарий не может быть пустым'
    });
    return;
  }

  try {
    await commentService.createComment(props.videoId, newComment.value);
    newComment.value = '';
    await loadComments();
    $q.notify({
      type: 'positive',
      message: 'Комментарий добавлен'
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при добавлении комментария'
    });
  }
};

const updateComment = async () => {
  if (!editingComment.value) return;

  try {
    await commentService.updateComment(
      editingComment.value.id,
      editingComment.value.content
    );
    await loadComments();
    editingComment.value = null;
    $q.notify({
      type: 'positive',
      message: 'Комментарий обновлен'
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при обновлении комментария'
    });
  }
};

const confirmDelete = (comment: Comment) => {
  commentToDelete.value = comment;
  deleteDialog.value = true;
};

const deleteComment = async () => {
  if (!commentToDelete.value) return;

  try {
    await commentService.deleteComment(commentToDelete.value.id);
    await loadComments();
    $q.notify({
      type: 'positive',
      message: 'Комментарий удален'
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при удалении комментария'
    });
  }
};

onMounted(async () => {
  await loadComments();
});
</script>

<style scoped>
.comment-section {
  max-width: 1200px;
  margin: 0 auto;
}

.comment-form {
  max-width: 800px;
}

.comment-item {
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
}

.comment-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.comment-item:hover .comment-actions {
  opacity: 1;
}

.edit-form {
  max-width: 600px;
}

.custom-textarea :deep(.q-field__control) {
  border-radius: 8px;
}

.custom-textarea :deep(.q-field__native) {
  resize: none !important;
  padding: 8px;
}

.custom-textarea :deep(.q-field__bottom) {
  padding: 4px 12px;
}

.comment-section {
  max-width: 1200px;
  margin: 0 auto;
}

.comment-item {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.comment-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.comment-content {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}

.comment-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.comment-item:hover .comment-actions {
  opacity: 1;
}

.edit-form {
  max-width: 600px;
}

.custom-textarea :deep(.q-field__control) {
  border-radius: 8px;
}

.custom-textarea :deep(.q-field__native) {
  resize: none !important;
  padding: 8px;
}

.custom-textarea :deep(.q-field__bottom) {
  padding: 4px 12px;
}

:deep(.q-item__section--avatar) {
  min-width: 48px;
}
</style>