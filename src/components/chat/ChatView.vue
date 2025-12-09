<template>
  <Layout>
    <div class="chat-view">
      <!-- Global Search Box Teleported to Layout Header -->
      <Teleport to="#global-search" v-if="mounted">
        <el-input
          v-model="searchQuery"
          :placeholder="t('chat.searchMessages')"
          :prefix-icon="Search"
          clearable
          style="width: 150px"
          size="small"
        />
      </Teleport>
      
      <!-- Main Content Area -->
      <div class="chat-main">
        <!-- Left Outline Panel -->
        <ChatOutline
          :messages="outlineMessages"
          :active-message-id="activeMessageId"
          :is-input-hidden="isInputHidden"
          :matched-message-ids="matchedMessageIds"
          @restore-input="isInputHidden = false"
          @scroll-to-message="handleScrollToMessage"
          @restore-message="handleRestoreMessage"
        />

        <!-- Messages Area -->
        <div class="messages-wrapper">
          <!-- Toolbar above messages -->
          <ChatToolbar
            :search-query="searchQuery"
            :matched-message-ids="matchedMessageIds"
            :current-running-model="currentRunningModel"
            :message-count="currentMessages.length"
            @new-chat="handleNewChat"
          />

          <MessageList
            ref="messageListRef"
            :messages="currentMessages"
            :current-running-model="currentRunningModel"
            :generating="generating"
            :matched-message-ids="matchedMessageIds"
            @delete="handleDeleteMessage"
            @regenerate="handleRegenerateMessage"
            @hide="handleHideMessage"
            @update:active-message-id="activeMessageId = $event"
          />

          <!-- Floating Input Area -->
          <ChatInput
            ref="chatInputRef"
            :generating="generating"
            :current-running-model="currentRunningModel"
            @send="handleSendMessage"
            @stop="handleStopGeneration"
            @open-settings="showSettingsDialog = true"
          />
        </div>
      </div>
      
      <!-- Settings Modal Dialog -->
      <ChatSettingsDialog
        v-model="showSettingsDialog"
        :settings="localSettings"
        @update:settings="Object.assign(localSettings, $event)"
        @reset-param="resetParam"
        @reset-all="resetSessionSettings"
        @confirm="saveAndCloseSettings"
      />
    </div>
  </Layout>
</template>

<script>
import { useChatView } from '@/composables/chat/useChatView'
import Layout from '@/components/Layout.vue'
import ChatOutline from '@/components/chat/ChatOutline.vue'
import ChatToolbar from '@/components/chat/ChatToolbar.vue'
import MessageList from '@/components/chat/MessageList.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ChatSettingsDialog from '@/components/chat/ChatSettingsDialog.vue'

export default {
  components: {
    Layout,
    ChatOutline,
    ChatToolbar,
    MessageList,
    ChatInput,
    ChatSettingsDialog
  },
  setup() {
    return useChatView()
  }
}
</script>
