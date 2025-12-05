<template>
  <Sidebar title="设置分类">
    <div class="category-list">
      <template v-if="activeTab === 'general'">
        <div 
          class="category-item" 
          @click="scrollToSection('connection')"
        >
          <span class="category-name">连接设置</span>
        </div>
        <div 
          class="category-item" 
          @click="scrollToSection('appearance')"
        >
          <span class="category-name">外观设置</span>
        </div>
      </template>
      
      <template v-else-if="activeTab === 'advanced'">
        <div 
          class="category-item" 
          @click="scrollToSection('basic-generation')"
        >
          <span class="category-name">基础生成参数</span>
        </div>
        <div 
          class="category-item" 
          @click="scrollToSection('sampling')"
        >
          <span class="category-name">采样参数</span>
        </div>
        <div 
          class="category-item" 
          @click="scrollToSection('repetition')"
        >
          <span class="category-name">重复惩罚参数</span>
        </div>
        <div 
          class="category-item" 
          @click="scrollToSection('context')"
        >
          <span class="category-name">上下文参数</span>
        </div>
        <div 
          class="category-item" 
          @click="scrollToSection('hardware')"
        >
          <span class="category-name">硬件参数</span>
        </div>
        <div 
          class="category-item" 
          @click="scrollToSection('other')"
        >
          <span class="category-name">其他参数</span>
        </div>
      </template>
    </div>
  </Sidebar>
</template>

<script setup>
import Sidebar from '@/components/common/Sidebar.vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['scroll-to'])

const scrollToSection = (section) => {
  emit('scroll-to', section)
}
</script>

<style scoped>
.category-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.category-item:hover {
  background: #f5f7fa;
  color: #333;
}

.category-name {
  flex: 1;
}

/* 在这里添加设置项的样式，使其与其它面板保持一致 */
.settings-item {
  height: 56px; /* 统一标题行高度 */
  font-size: 16px; /* 统一字体大小 */
  text-align: left; /* 左对齐 */
}
</style>