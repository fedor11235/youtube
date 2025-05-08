<template>
  <div class="comment-wrapper q-mb-md" :class="{ 'reply-comment': isReply }">
    <q-item class="comment-item">
      <q-item-section class="comment-item__avatar" style="justify-content: start;" avatar>
        <ChannelAvatar
          :avatar="comment.channel.avatar"
          :url="comment.channel.url"
          :username="comment.channel.username"
          size="40px"
          class="q-mr-md"
        />
      </q-item-section>

      <q-item-section>
        <div class="row justify-between items-center">
          <div class="row items-center">
            <q-item-label class="text-weight-bold">
              {{ comment.channel.username }}
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
            <div v-if="!isReply" class="reply-section q-mt-sm">
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
        <div v-if="showReplyForm && !isReply" class="reply-form q-mt-md">
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

        <div v-if="comment.replies && comment.replies.length" class="replies-list q-mt-md q-ml-lg">
          <VideoComment
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :is-reply="true"
            :video-author-id="videoAuthorId"
            @update-reply="(id, content) => $emit('update-reply', id, content)"
            @update-comment="(id, content) => $emit('update-comment', id, content)"
            @delete-comment="(comment) =>$emit('delete-comment', comment)"
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
import ChannelAvatar from './ChannelAvatar.vue';
import LikeComment from './LikeComment.vue';
import { formatDate } from '../utils/date'

const props = defineProps<{
  comment: Comment;
  videoAuthorId: number;
  isReply?: boolean;
  // node: any;
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
  return props.comment.channel.id === props.videoAuthorId;
});

const isAuthorLike = computed(() => {
  return props.comment.authorLiked;
});

const isOwner = computed(() => {
  return authStore.channel?.id === props.comment.channel.id;
});

const submitReply = () => {
  if (!replyContent.value.trim()) return;
  
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

<style lang="scss" scoped>
.comment-item {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
    
    .comment-actions {
      opacity: 1;
    }
  }
}

.comment-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.edit-form {
  max-width: 600px;
}

.custom-textarea {
  :deep(.q-field__control) {
    border-radius: 8px;
  }
  
  :deep(.q-field__native) {
    resize: none !important;
    padding: 8px;
  }
  
  :deep(.q-field__bottom) {
    padding: 4px 12px;
  }
}

.comment-wrapper {
  &.reply-comment {
    margin-left: 40px;
    border-left: 2px solid $grey-4;
    padding-left: 16px;
  }
}

.replies-list {
  .reply-comment {
    margin-left: 0;
  }
}
</style>