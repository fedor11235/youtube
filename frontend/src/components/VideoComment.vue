<template>
  <q-item class="comment-item q-mb-md" v-ripple>
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
        <q-item-label class="text-weight-bold">
          {{ comment.user.username }}
          <span class="text-grey-6 text-caption q-ml-sm">
            {{ formatDate(comment.createdAt) }}
            <template v-if="comment.updatedAt !== comment.createdAt">
              • изменено {{ formatDate(comment.updatedAt) }}
            </template>
          </span>
        </q-item-label>

        

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
        </div>

        <LikeComment
          :comment-id="comment.id"
          :initial-likes-count="comment.likesCount"
          :is-author-like="isAuthorLike"
        />
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
          @click="$emit('delete', comment)"
        >
          <q-tooltip>Удалить</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import type { Comment } from 'src/services/comment';
import UserAvatar from './UserAvatar.vue';
import LikeComment from './LikeComment.vue';

const props = defineProps<{
  comment: Comment;
  videoAuthorId: number;
}>();

const emit = defineEmits<{
  (e: 'update', id: number, content: string): void;
  (e: 'delete', comment: Comment): void;
}>();

const authStore = useAuthStore();
const isEditing = ref(false);
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU');
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
  if (!editContent.value.trim()) return;
  emit('update', props.comment.id, editContent.value);
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