<template>
  <div class="comment-wrapper q-mb-md">
    <q-item class="comment-item">
      <q-item-section avatar>
        <UserAvatar
          :avatar="comment.user.avatar"
          :url="comment.user.url"
          :username="comment.user.username"
          size="40px"
          class="q-mr-md"
        />
      </q-item-section>

      <q-item-section>
        <div class="row justify-between items-center">
          <div class="row items-center">
            <q-item-label class="text-weight-bold">
              {{ comment.user.username }}
              <q-badge
                v-if="isAuthor"
                color="primary"
                class="q-ml-sm author-badge"
                align="middle"
              >
                Автор
              </q-badge>
            </q-item-label>
            <span class="text-grey-6 text-caption q-ml-sm">
              {{ formatDate(comment.createdAt) }}
              <template v-if="comment.updatedAt !== comment.createdAt">
                • изменено {{ formatDate(comment.updatedAt) }}
              </template>
            </span>
          </div>

          <div class="row items-center q-gutter-sm">
            <LikeComment
              :comment-id="comment.id"
              :initial-likes-count="comment.likesCount"
              :is-author-like="isAuthorLike"
              :is-creator-like="comment.isCreatorLike"
            />
            <q-btn
              flat
              dense
              color="grey"
              icon="reply"
              @click="showReplyForm = !showReplyForm"
            >
              <q-tooltip>Ответить</q-tooltip>
            </q-btn>
          </div>
        </div>

        <q-item-label v-if="!isEditing">
          {{ comment.content }}
        </q-item-label>

        <div v-else class="edit-form q-mt-sm">
          <q-input
            v-model="editContent"
            type="textarea"
            :input-style="{ minHeight: '60px', maxHeight: '60px', lineHeight: '1.5' }"
            class="custom-textarea"
            outlined
            dense
            autofocus
            counter
            maxlength="1000"
            :rules="[val => !!val || 'Комментарий не может быть пустым']"
            @keyup.enter.ctrl="saveEdit"
          >
            <template v-slot:hint>
              Нажмите Ctrl + Enter для сохранения
            </template>
          </q-input>
          <div class="row justify-end q-mt-sm q-gutter-sm">
            <q-btn
              flat
              label="Отмена"
              color="grey"
              v-close-popup
              @click="cancelEdit"
            />
            <q-btn
              flat
              label="Сохранить"
              color="primary"
              :disable="!editContent.trim()"
              @click="saveEdit"
            />
          </div>
        </div>

        <!-- Форма ответа на комментарий -->
        <div v-if="showReplyForm" class="reply-form q-mt-md">
          <q-input
            v-model="replyContent"
            type="textarea"
            :input-style="{ minHeight: '60px', maxHeight: '60px', lineHeight: '1.5' }"
            class="custom-textarea"
            outlined
            dense
            placeholder="Написать ответ..."
            counter
            maxlength="1000"
            :rules="[val => !!val || 'Ответ не может быть пустым']"
            @keyup.enter.ctrl="submitReply"
          >
            <template v-slot:hint>
              Нажмите Ctrl + Enter для отправки
            </template>
          </q-input>
          <div class="row justify-end q-mt-sm q-gutter-sm">
            <q-btn
              flat
              label="Отмена"
              color="grey"
              @click="cancelReply"
            />
            <q-btn
              flat
              label="Ответить"
              color="primary"
              :disable="!replyContent.trim()"
              @click="submitReply"
            />
          </div>
        </div>

        <!-- Список ответов -->
        <div v-if="comment.replies && comment.replies.length" class="replies-list q-mt-md q-ml-lg">
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :is-author="isAuthor"
            :is-owner="isOwner"
            class="reply-item"
            @delete="$emit('delete-comment', reply)"
          />
        </div>

        <div
          v-if="isOwner && !isEditing"
          class="comment-actions q-mt-sm"
        >
          <q-btn
            flat
            dense
            color="grey"
            icon="edit"
            @click="startEdit"
          >
            <q-tooltip>Редактировать</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            color="negative"
            icon="delete"
            @click="$emit('delete-comment', comment)"
          >
            <q-tooltip>Удалить</q-tooltip>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import type { Comment } from 'src/services/comment';
import UserAvatar from './UserAvatar.vue';
import LikeComment from './LikeComment.vue';
import { formatDate } from '../utils/date'

const props = defineProps<{
  comment: Comment;
  videoAuthorId: number;
}>();

const emit = defineEmits<{
  (e: 'update-comment', id: number, content: string): void;
  (e: 'update-reply', id: number, content: string): void;
  (e: 'delete-comment', comment: Comment): void;
}>();

const authStore = useAuthStore();
const isEditing = ref(false);
const showReplyForm = ref(false);
const replyContent = ref('');
const editContent = ref(props.comment.content);


const isAuthor = computed(() => {
  return props.comment.user.id === props.videoAuthorId;
});

const isAuthorLike = computed(() => {
  return props.comment.authorLiked;
});

const isOwner = computed(() => {
  return authStore.user?.id === props.comment.user.id;
});

const submitReply = () => {
  if (!replyContent.value.trim()) return;
  console.log("!@#$")
  
  try {
    emit('update-reply', props.comment.id, replyContent.value);
    replyContent.value = '';
    showReplyForm.value = false;
  } catch (error) {
    console.error('Ошибка при создании ответа:', error);
  }
};

const cancelReply = () => {
  showReplyForm.value = false;
  replyContent.value = '';
};

const startEdit = () => {
  editContent.value = props.comment.content;
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  editContent.value = props.comment.content;
};

const saveEdit = () => {
  console.log("props.comment: ", props.comment)
  console.log("editContent.value : ", editContent.value.trim() )
  if (!editContent.value.trim()) return;
  emit('update-comment', props.comment.id, editContent.value);
  isEditing.value = false;
};
</script>

<style scoped>
.comment-item {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.comment-item:hover {
  background: rgba(0, 0, 0, 0.04);
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

.like-comment {
  display: inline-flex;
  align-items: center;
}

.likes-info {
  display: flex;
  align-items: center;
}

.like-button {
  transition: transform 0.2s ease;
}

.like-button:hover {
  transform: scale(1.1);
}
</style>