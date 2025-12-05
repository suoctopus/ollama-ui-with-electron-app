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
          :placeholder="$t('chat.inputPlaceholder')"
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
          <el-button text :icon="Settings2" @click="$emit('open-settings')" class="tool-btn-text">设置</el-button>
        </div>
        
        <!-- Right Send Button -->
        <div class="toolbar-right">
          <el-button
            v-if="generating"
            @click="$emit('stop')"
            :icon="Square"
            type="danger"
          >
            {{ $t('chat.stop') }}
          </el-button>
          <el-button
            v-else
            @click="handleSend"
            :icon="Send"
            type="primary"
            :disabled="!inputContent.trim() || !currentRunningModel"
          >
            {{ $t('chat.send') }}
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

<script setup>
import { ref } from 'vue'
import { Plus as PlusIcon, Send, Square, X, Settings2 } from 'lucide-vue-next'

const props = defineProps({
  generating: {
    type: Boolean,
    default: false
  },
  currentRunningModel: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['send', 'stop', 'open-settings'])

const inputContent = ref('')
const images = ref([])
const enableThink = ref(false)
const fileInput = ref(null)

const triggerImageUpload = () => {
  fileInput.value?.click()
}

const handleImageSelect = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        images.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  event.target.value = ''
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const handleSend = () => {
  if (!inputContent.value.trim() || !props.currentRunningModel || props.generating) return
  
  emit('send', {
    content: inputContent.value.trim(),
    images: [...images.value], // Send copy
    think: enableThink.value
  })
  
  // Clear input after sending (parent will handle the actual API call, but we clear UI immediately for better UX? 
  // Or wait? Usually clear immediately)
  inputContent.value = ''
  images.value = []
}

const setInput = (text) => {
  inputContent.value = text
}

const reset = () => {
  inputContent.value = ''
  images.value = []
}

defineExpose({
  setInput,
  reset
})
</script>

<style scoped>
/* Floating Input Area */
.input-float-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  pointer-events: none;
}

.input-float-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  padding: 16px;
  pointer-events: auto;
}

.image-preview {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-item .el-button {
  position: absolute;
  top: 2px;
  right: 2px;
}

.input-box :deep(.el-textarea__inner) {
  border: none;
  box-shadow: none;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  background: transparent;
}

.input-box :deep(.el-textarea__inner):focus {
  box-shadow: none;
}

.input-toolbar-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tool-btn-text {
  font-size: 13px;
  color: #666;
}

.think-toggle-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
}

.think-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}
</style>
