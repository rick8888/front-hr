<template>
  <main class="mx-auto flex h-[calc(100vh-7rem)] max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
    <header class="mb-4 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-neutral-900">{{ t("chat.title") }}</h1>
        <p class="mt-1 text-sm text-neutral-500">{{ t("chat.subtitle") }}</p>
      </div>
      <div class="flex items-center gap-2 text-xs text-neutral-500" role="status">
        <span
          class="h-2 w-2 rounded-full"
          :class="realtimeStatus === 'connected' ? 'bg-green-500' : 'bg-amber-400'"
        />
        {{ t(`chat.connection.${realtimeStatus}`) }}
      </div>
    </header>

    <section class="grid min-h-0 flex-1 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm md:grid-cols-[16rem_1fr]">
      <aside class="min-h-0 border-b border-neutral-200 md:border-b-0 md:border-r">
        <div class="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <h2 class="text-sm font-semibold text-neutral-800">{{ t("chat.channels") }}</h2>
          <button
            type="button"
            class="text-xs font-medium text-primary-700 hover:text-primary-900"
            :disabled="loadingChannels"
            @click="loadChannels"
          >
            {{ t("common.refresh") }}
          </button>
        </div>
        <p v-if="channelError" class="px-4 py-3 text-sm text-red-600">{{ channelError }}</p>
        <p v-else-if="loadingChannels" class="px-4 py-3 text-sm text-neutral-500">{{ t("common.loading") }}</p>
        <p v-else-if="!channels.length" class="px-4 py-3 text-sm text-neutral-500">{{ t("chat.noChannels") }}</p>
        <ul v-else class="max-h-40 overflow-y-auto p-2 md:max-h-full">
          <li v-for="channel in channels" :key="channel.id">
            <button
              type="button"
              class="w-full rounded-lg px-3 py-2 text-left transition-colors"
              :class="selectedChannel?.id === channel.id ? 'bg-primary-50 text-primary-900' : 'text-neutral-700 hover:bg-neutral-50'"
              @click="selectChannel(channel)"
            >
              <span class="block truncate text-sm font-medium">{{ channel.name }}</span>
              <span class="mt-0.5 block truncate text-xs text-neutral-500">
                {{ channel.latest_message?.body || (channel.latest_message?.attachments?.length ? t("chat.fileAttachment") : t("chat.noMessages")) }}
              </span>
            </button>
          </li>
        </ul>
      </aside>

      <div class="flex min-h-0 flex-col">
        <div class="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-3">
          <h2 class="truncate text-sm font-semibold text-neutral-800">
            {{ selectedChannel?.name || t("chat.selectChannel") }}
          </h2>
          <button
            v-if="selectedChannel"
            type="button"
            class="shrink-0 text-xs font-medium text-primary-700 hover:text-primary-900"
            :disabled="loadingMessages"
            @click="reloadMessages"
          >
            {{ t("common.refresh") }}
          </button>
        </div>

        <div ref="messageList" class="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
          <p v-if="messagesError" class="text-sm text-red-600">{{ messagesError }}</p>
          <p v-else-if="loadingMessages" class="text-center text-sm text-neutral-500">{{ t("common.loading") }}</p>
          <p v-else-if="selectedChannel && !messages.length" class="pt-8 text-center text-sm text-neutral-500">
            {{ t("chat.noMessages") }}
          </p>
          <article
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.sender?.id === currentUserId ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] rounded-2xl px-4 py-2.5 sm:max-w-[70%]"
              :class="message.sender?.id === currentUserId ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-900'"
            >
              <p v-if="message.sender?.id !== currentUserId" class="mb-1 text-xs font-semibold text-neutral-600">
                {{ message.sender?.name || t("chat.unknownSender") }}
              </p>
              <p v-if="message.body" class="whitespace-pre-wrap break-words text-sm">{{ message.body }}</p>
              <ul v-if="message.attachments?.length" class="mt-2 space-y-1.5">
                <li v-for="attachment in message.attachments" :key="attachment.id">
                  <button
                    type="button"
                    class="flex max-w-full items-center gap-2 rounded-md bg-black/5 px-2.5 py-1.5 text-left text-xs underline-offset-2 hover:underline"
                    :disabled="downloadingAttachmentId === attachment.id"
                    @click="downloadAttachment(attachment)"
                  >
                    <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16V4m0 12l-4-4m4 4l4-4M4 20h16" />
                    </svg>
                    <span class="truncate">{{ attachment.name }}</span>
                    <span class="shrink-0 opacity-70">{{ formatFileSize(attachment.size) }}</span>
                  </button>
                </li>
              </ul>
              <time class="mt-1 block text-right text-[11px]" :class="message.sender?.id === currentUserId ? 'text-primary-100' : 'text-neutral-500'">
                {{ formatTime(message.created_at) }}
              </time>
            </div>
          </article>
        </div>

        <form class="border-t border-neutral-100 p-3 sm:p-4" @submit.prevent="sendMessage">
          <div v-if="selectedFiles.length" class="mb-2 flex flex-wrap gap-2">
            <span
              v-for="(file, index) in selectedFiles"
              :key="`${file.name}-${file.size}-${index}`"
              class="inline-flex max-w-full items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
            >
              <span class="max-w-48 truncate">{{ file.name }}</span>
              <button
                type="button"
                class="font-bold text-neutral-500 hover:text-neutral-900"
                :aria-label="t('chat.removeAttachment', { name: file.name })"
                :disabled="sending"
                @click="removeSelectedFile(index)"
              >
                ×
              </button>
            </span>
          </div>
          <div class="flex items-end gap-2">
            <label
              class="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
              :class="{ 'cursor-not-allowed opacity-50': !selectedChannel || sending }"
              :title="t('chat.attachFiles')"
            >
              <input
                class="sr-only"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx,.csv,.txt"
                :disabled="!selectedChannel || sending"
                @change="onFilesSelected"
              >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.2-9.19a4 4 0 015.65 5.66l-9.2 9.19a2 2 0 01-2.82-2.83l8.48-8.48" />
              </svg>
            </label>
            <label class="sr-only" for="chat-message">{{ t("chat.messagePlaceholder") }}</label>
            <textarea
              id="chat-message"
              v-model="draft"
              rows="1"
              maxlength="5000"
              class="max-h-28 min-h-11 flex-1 resize-y rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-50"
              :placeholder="t('chat.messagePlaceholder')"
              :disabled="!selectedChannel || sending"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <button
              type="submit"
              class="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!selectedChannel || (!draft.trim() && !selectedFiles.length) || sending"
            >
              {{ sending ? t("chat.sending") : t("chat.send") }}
            </button>
          </div>
        </form>
        <p v-if="sendError" class="px-4 pb-3 text-sm text-red-600">{{ sendError }}</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useAuthStore } from "../stores/authStore.js";
import { useI18n } from "../i18n/index.js";
import apiClient from "../services/api.js";
import { createChatRealtime } from "../services/chatRealtime.js";

const { t } = useI18n();
const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id);
const channels = ref([]);
const selectedChannel = ref(null);
const messages = ref([]);
const messageList = ref(null);
const draft = ref("");
const selectedFiles = ref([]);
const downloadingAttachmentId = ref(null);
const loadingChannels = ref(false);
const loadingMessages = ref(false);
const sending = ref(false);
const channelError = ref("");
const messagesError = ref("");
const sendError = ref("");
const realtimeStatus = ref("connecting");

let echo = null;
let subscribedChannel = null;

function responseData(response) {
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

function errorText(error) {
  const validationErrors = error.response?.data?.errors;
  const firstValidationError = validationErrors
    ? Object.values(validationErrors).flat()[0]
    : null;
  return firstValidationError || error.response?.data?.message || t("chat.error");
}

async function loadChannels() {
  loadingChannels.value = true;
  channelError.value = "";
  try {
    const response = await apiClient.get("/chat/channels");
    const nextChannels = responseData(response);
    channels.value = nextChannels;
    if (selectedChannel.value) {
      const current = nextChannels.find((channel) => channel.id === selectedChannel.value.id);
      if (current) {
        selectedChannel.value = current;
      } else {
        leaveSelectedChannel();
        selectedChannel.value = null;
        messages.value = [];
      }
    }
    if (!selectedChannel.value && nextChannels.length) {
      await selectChannel(nextChannels[0]);
    }
  } catch (error) {
    channelError.value = errorText(error);
  } finally {
    loadingChannels.value = false;
  }
}

function leaveSelectedChannel() {
  if (echo && subscribedChannel) {
    echo.leave(`chat.channel.${subscribedChannel}`);
  }
  subscribedChannel = null;
}

async function selectChannel(channel) {
  if (selectedChannel.value?.id === channel.id) return;
  leaveSelectedChannel();
  selectedChannel.value = channel;
  messages.value = [];
  messagesError.value = "";
  loadingMessages.value = true;
  try {
    const response = await apiClient.get(`/chat/channels/${channel.id}/messages`);
    if (selectedChannel.value?.id !== channel.id) return;
    messages.value = responseData(response);
    subscribeToChannel(channel.id);
    await scrollToLatest();
  } catch (error) {
    if (selectedChannel.value?.id === channel.id) messagesError.value = errorText(error);
  } finally {
    if (selectedChannel.value?.id === channel.id) loadingMessages.value = false;
  }
}

async function reloadMessages() {
  const channel = selectedChannel.value;
  if (!channel || loadingMessages.value) return;

  loadingMessages.value = true;
  messagesError.value = "";
  try {
    const response = await apiClient.get(`/chat/channels/${channel.id}/messages`);
    if (selectedChannel.value?.id === channel.id) {
      messages.value = responseData(response);
      await scrollToLatest();
    }
  } catch (error) {
    if (selectedChannel.value?.id === channel.id) messagesError.value = errorText(error);
  } finally {
    if (selectedChannel.value?.id === channel.id) loadingMessages.value = false;
  }
}

function subscribeToChannel(channelId) {
  if (!echo || !channelId) return;
  subscribedChannel = channelId;
  echo.private(`chat.channel.${channelId}`).listen(".chat.message.sent", (event) => {
    const message = event.message;
    if (!messages.value.some((item) => item.id === message.id)) {
      messages.value.push(message);
      scrollToLatest();
    }
  });
}

async function sendMessage() {
  const body = draft.value.trim();
  const channel = selectedChannel.value;
  const files = [...selectedFiles.value];
  if ((!body && !files.length) || !channel || sending.value) return;

  sending.value = true;
  sendError.value = "";
  try {
    const formData = new FormData();
    if (body) formData.append("body", body);
    files.forEach((file) => formData.append("attachments[]", file));
    const response = await apiClient.post(
      `/chat/channels/${channel.id}/messages`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const message = response.data?.data;
    if (message && selectedChannel.value?.id === channel.id && !messages.value.some((item) => item.id === message.id)) {
      messages.value.push(message);
      await scrollToLatest();
    }
    draft.value = "";
    selectedFiles.value = [];
    const channelItem = channels.value.find((item) => item.id === channel.id);
    if (channelItem && message) channelItem.latest_message = message;
  } catch (error) {
    sendError.value = errorText(error);
  } finally {
    sending.value = false;
  }
}

function onFilesSelected(event) {
  const newlySelected = Array.from(event.target.files || []);
  const combined = [...selectedFiles.value, ...newlySelected];
  if (combined.length > 5) {
    sendError.value = t("chat.maxAttachments");
    event.target.value = "";
    return;
  }
  selectedFiles.value = combined;
  sendError.value = "";
  event.target.value = "";
}

function removeSelectedFile(index) {
  selectedFiles.value.splice(index, 1);
}

async function downloadAttachment(attachment) {
  if (downloadingAttachmentId.value !== null) return;

  downloadingAttachmentId.value = attachment.id;
  sendError.value = "";
  try {
    const response = await apiClient.get(
      `/chat/attachments/${attachment.id}/download`,
      { responseType: "blob" },
    );
    const url = URL.createObjectURL(response.data);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = attachment.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    sendError.value = errorText(error);
  } finally {
    downloadingAttachmentId.value = null;
  }
}

function formatFileSize(bytes) {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

async function scrollToLatest() {
  await nextTick();
  if (messageList.value) messageList.value.scrollTop = messageList.value.scrollHeight;
}

onMounted(async () => {
  try {
    echo = createChatRealtime();
    echo.connector.pusher.connection.bind("state_change", ({ current }) => {
      realtimeStatus.value =
        current === "connected"
          ? "connected"
          : ["initialized", "connecting"].includes(current)
            ? "connecting"
            : "disconnected";
    });
    echo.connector.pusher.connection.bind("error", () => {
      realtimeStatus.value = "disconnected";
    });
  } catch {
    realtimeStatus.value = "disconnected";
  }
  await loadChannels();
});

onBeforeUnmount(() => {
  leaveSelectedChannel();
  echo?.disconnect();
});
</script>
