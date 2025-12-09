<template>
  <div class="input-float-wrapper">
    <div class="input-float-card">
      <!-- Image Preview -->
      <div v-if="images.length > 0" class="image-preview">
        <div v-for="(img, index) in images" :key="index" class="preview-item">
          <img :src="img" alt="preview" />
          <el-button
            circle
            size="small"
            type="danger"
            @click="removeImage(index)"
            :icon="X"
          />
        </div>
      </div>
      
      <!-- Input Box -->
      <div class="input-box">
        <el-input
          v-model="inputContent"
          type="textarea"
          :placeholder="t('chat.inputPlaceholder')"
          :rows="3"
          resize="none"
          @keydown.enter.exact.prevent="handleSend"
        />
      </div>
      
      <!-- Toolbar Below Input -->
      <div class="input-toolbar-bottom">
        <!-- Left Tools -->
        <div class="toolbar-left">
          <!-- Plus Upload Button -->
          <el-button 
            circle
            :icon="PlusIcon" 
            @click="triggerImageUpload"
            class="upload-btn"
            title="上传图片"
          />
          
          <!-- Think Toggle -->
          <div class="think-toggle-inline">
            <el-switch
              v-model="enableThink"
              size="small"
            />
            <span class="think-label">思考</span>
          </div>
          
          <!-- Settings Button -->
          <el-button text :icon="Settings2" @click="openSettings" class="tool-btn-text">设置</el-button>
        </div>
        
        <!-- Right Send Button -->
        <div class="toolbar-right">
          <el-button
            v-if="generating"
            @click="stop"
            :icon="Square"
            type="danger"
          >
            {{ t('chat.stop') }}
          </el-button>
          <el-button
            v-else
            @click="handleSend"
            :icon="Send"
            type="primary"
            :disabled="!inputContent.trim() || !currentRunningModel"
          >
            {{ t('chat.send') }}
          </el-button>
        </div>
      </div>
      
      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleImageSelect"
      />
    </div>
  </div>
</template>

<script>
import { useChatInput } from '@/composables/chat/useChatInput'

export default {
  props: {
    generating: {
      type: Boolean,
      default: false
    },
    currentRunningModel: {
      type: String,
      default: null
    }
  },
  emits: ['send', 'stop', 'open-settings'],
  setup(props, { emit, expose }) {
    const composable = useChatInput(props, emit)
    
    // Expose methods for parent component access
    expose({
      setInput: composable.setInput,
      reset: composable.reset
    })
    
    return composable
  }
}
</script>