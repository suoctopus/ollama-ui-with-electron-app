<template>
  <Layout>
    <div class="settings-view">
      <!-- Global Search Box Teleported to Layout Header -->
      <Teleport to="#global-search" v-if="mounted">
        <el-input
          v-model="searchQuery"
          :placeholder="t('settings.search')"
          :prefix-icon="SearchIcon"
          clearable
          style="width: 150px"
          size="small"
        />
      </Teleport>
      
      <div class="settings-container">
        <!-- Left Sidebar -->
        <SettingsSidebar
          :active-tab="activeTab"
          v-model="currentSection"
          @scroll-to="handleScrollTo"
        />

        <!-- Main Content -->
        <div class="settings-main">
          <!-- Toolbar -->
          <div class="settings-toolbar">
            <el-button-group>
              <el-button 
                :type="activeTab === 'general' ? 'primary' : 'default'"
                @click="activeTab = 'general'"
                size="small"
              >
                {{ t('settings.general') }}
              </el-button>
              <el-button 
                :type="activeTab === 'advanced' ? 'primary' : 'default'"
                @click="activeTab = 'advanced'"
                size="small"
              >
                {{ t('settings.advancedSettings') }}
              </el-button>
            </el-button-group>
          </div>

          <div class="settings-content" ref="settingsContent">
            <!-- General Settings -->
            <GeneralSettings
              v-show="activeTab === 'general'"
              ref="generalSettings"
              :local-settings="localSettings"
              :testing="testing"
              :connection-status="connectionStatus"
              @test-connection="handleTestConnection"
              @reset-key="handleResetKey"
              @reset="handleReset"
              @save="handleSave"
            />
          
            <!-- Advanced Settings -->
            <AdvancedSettings
              v-show="activeTab === 'advanced'"
              ref="advancedSettings"
              :local-settings="localSettings"
              v-model:isKeepAlivePermanent="isKeepAlivePermanent"
              @reset-key="handleResetKey"
              @reset="handleReset"
              @save="handleSave"
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout.vue'
import SettingsSidebar from '@/components/settings/SettingsSidebar.vue'
import GeneralSettings from '@/components/settings/GeneralSettings.vue'
import AdvancedSettings from '@/components/settings/AdvancedSettings.vue'
import { useSettingsView } from '@/composables/settings/useSettingsView'

export default {
  components: {
    Layout,
    SettingsSidebar,
    GeneralSettings,
    AdvancedSettings
  },
  setup() {
    return useSettingsView()
  }
}
</script>
