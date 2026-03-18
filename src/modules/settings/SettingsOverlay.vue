<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores'
import type { EmailAccount, EmailTemplate, AIModelConfig, KnowledgeTerm, Shortcut } from '@/types'
import Modal from '@/components/common/Modal.vue'
import Tabs from '@/components/common/Tabs.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Switch from '@/components/common/Switch.vue'
import Icon from '@/components/common/Icon.vue'

const settingsStore = useSettingsStore()

const tabs = [
  { id: 'accounts', label: '邮箱账号', icon: 'inbox' },
  { id: 'editor', label: '编辑器', icon: 'pen' },
  { id: 'templates', label: '模板', icon: 'folder' },
  { id: 'shortcuts', label: '快捷键', icon: 'menu' },
  { id: 'ai', label: 'AI设置', icon: 'ai' }
]

// ========== 通用模态框状态 ==========
const showAccountModal = ref(false)
const showTemplateModal = ref(false)
const showModelModal = ref(false)
const showTermModal = ref(false)
const editingItem = ref<any>(null)

// ========== 编辑中的数据 ==========
const editingAccount = ref<Partial<EmailAccount>>({})
const editingTemplate = ref<Partial<EmailTemplate>>({})
const editingModel = ref<Partial<AIModelConfig>>({})
const editingTerm = ref<Partial<KnowledgeTerm>>({})
const newTemplateVariable = ref('')

// ========== 快捷键编辑 ==========
const editingShortcutId = ref<string | null>(null)
const isRecording = ref(false)
const tempShortcut = ref<Partial<Shortcut>>({})

// ========== 账号设置 ==========
function openAddAccount() {
  editingItem.value = null
  editingAccount.value = { isDefault: false }
  showAccountModal.value = true
}

function openEditAccount(account: EmailAccount) {
  editingItem.value = account
  editingAccount.value = { ...account }
  showAccountModal.value = true
}

function saveAccount() {
  if (editingItem.value) {
    settingsStore.updateAccount(editingItem.value.id, editingAccount.value)
  } else {
    settingsStore.addAccount(editingAccount.value as Omit<EmailAccount, 'id' | 'createdAt'>)
  }
  showAccountModal.value = false
}

function deleteAccount(id: string) {
  if (confirm('确定要删除这个账号吗？')) {
    settingsStore.deleteAccount(id)
  }
}

// ========== 编辑器设置 ==========
const fontOptions = ['Inter', 'Arial', 'Helvetica', 'Times New Roman', '宋体', '微软雅黑']
const fontSizeOptions = [12, 13, 14, 15, 16, 18, 20]

// ========== 模板设置 ==========
const templateCategories = ['外贸', '客服', '人事', '通用']

function openAddTemplate() {
  editingItem.value = null
  editingTemplate.value = { category: '通用', variables: [] }
  showTemplateModal.value = true
}

function openEditTemplate(template: EmailTemplate) {
  editingItem.value = template
  editingTemplate.value = { ...template, variables: [...template.variables] }
  showTemplateModal.value = true
}

function addTemplateVariable() {
  if (newTemplateVariable.value && !editingTemplate.value.variables?.includes(newTemplateVariable.value)) {
    editingTemplate.value.variables?.push(newTemplateVariable.value)
    newTemplateVariable.value = ''
  }
}

function removeTemplateVariable(v: string) {
  const idx = editingTemplate.value.variables?.indexOf(v)
  if (idx !== undefined && idx !== -1) {
    editingTemplate.value.variables?.splice(idx, 1)
  }
}

function saveTemplate() {
  if (editingItem.value) {
    settingsStore.updateTemplate(editingItem.value.id, editingTemplate.value)
  } else {
    settingsStore.addTemplate(editingTemplate.value as Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>)
  }
  showTemplateModal.value = false
}

function deleteTemplate(id: string) {
  if (confirm('确定要删除这个模板吗？')) {
    settingsStore.deleteTemplate(id)
  }
}

// ========== 快捷键设置 ==========
function startEditShortcut(shortcut: Shortcut) {
  editingShortcutId.value = shortcut.id
  tempShortcut.value = { ...shortcut }
  isRecording.value = true
}

function recordKeydown(e: KeyboardEvent) {
  if (!isRecording.value || !editingShortcutId.value) return
  e.preventDefault()
  tempShortcut.value = {
    ...tempShortcut.value,
    key: e.key.toUpperCase(),
    ctrl: e.ctrlKey || e.metaKey,
    shift: e.shiftKey,
    alt: e.altKey
  }
}

function saveShortcut() {
  if (!editingShortcutId.value) return
  const idx = settingsStore.settings.shortcuts.findIndex(s => s.id === editingShortcutId.value)
  if (idx !== -1) {
    Object.assign(settingsStore.settings.shortcuts[idx], tempShortcut.value)
  }
  cancelEditShortcut()
}

function cancelEditShortcut() {
  editingShortcutId.value = null
  isRecording.value = false
  tempShortcut.value = {}
}

// ========== AI设置 ==========
function openAddModel() {
  editingItem.value = null
  editingModel.value = { isDefault: false }
  showModelModal.value = true
}

function openEditModel(model: AIModelConfig) {
  editingItem.value = model
  editingModel.value = { ...model }
  showModelModal.value = true
}

function saveModel() {
  if (editingItem.value) {
    settingsStore.updateModelConfig(editingItem.value.id, editingModel.value)
  } else {
    settingsStore.addModelConfig(editingModel.value as Omit<AIModelConfig, 'id' | 'createdAt'>)
  }
  showModelModal.value = false
}

function deleteModel(id: string) {
  if (confirm('确定要删除这个模型配置吗？')) {
    settingsStore.deleteModelConfig(id)
  }
}

function openAddTerm() {
  editingItem.value = null
  editingTerm.value = { category: '贸易术语', tags: [] }
  showTermModal.value = true
}

function openEditTerm(term: KnowledgeTerm) {
  editingItem.value = term
  editingTerm.value = { ...term, tags: [...term.tags] }
  showTermModal.value = true
}

const newTermTag = ref('')
function addTermTag() {
  if (newTermTag.value && !editingTerm.value.tags?.includes(newTermTag.value)) {
    editingTerm.value.tags?.push(newTermTag.value)
    newTermTag.value = ''
  }
}
function removeTermTag(tag: string) {
  const idx = editingTerm.value.tags?.indexOf(tag)
  if (idx !== undefined && idx !== -1) editingTerm.value.tags?.splice(idx, 1)
}

function saveTerm() {
  if (editingItem.value) {
    settingsStore.updateKnowledgeTerm(editingItem.value.id, editingTerm.value)
  } else {
    settingsStore.addKnowledgeTerm(editingTerm.value as Omit<KnowledgeTerm, 'id'>)
  }
  showTermModal.value = false
}

function deleteTerm(id: string) {
  if (confirm('确定要删除这个术语吗？')) {
    settingsStore.deleteKnowledgeTerm(id)
  }
}
</script>

<template>
  <Modal
    :model-value="settingsStore.isModalOpen"
    title="设置"
    width="900px"
    @update:model-value="settingsStore.closeModal"
  >
    <div class="settings-content">
      <div class="settings-sidebar">
        <Tabs v-model="settingsStore.activeTab" :tabs="tabs" />
      </div>
      <div class="settings-main">

        <!-- ========== 邮箱账号设置 ========== -->
        <div v-if="settingsStore.activeTab === 'accounts'" class="settings-panel">
          <div class="panel-header">
            <h3>邮箱账号</h3>
            <Button variant="primary" size="sm" @click="openAddAccount">
              <Icon name="plus" /> 新增账号
            </Button>
          </div>
          <div class="account-list">
            <div v-for="acc in settingsStore.settings.accounts" :key="acc.id" class="item-card">
              <div class="item-info">
                <div class="item-name">
                  {{ acc.name }}
                  <span v-if="acc.isDefault" class="badge-default">默认</span>
                </div>
                <div class="item-desc">{{ acc.email }}</div>
              </div>
              <div class="item-actions">
                <Button variant="ghost" size="sm" @click="openEditAccount(acc)">编辑</Button>
                <Button
                  v-if="!acc.isDefault"
                  variant="ghost"
                  size="sm"
                  @click="settingsStore.setDefaultAccount(acc.id)"
                >设为默认</Button>
                <Button variant="ghost" size="sm" @click="deleteAccount(acc.id)">删除</Button>
              </div>
            </div>
            <div v-if="settingsStore.settings.accounts.length === 0" class="empty-state">
              暂无账号，点击上方按钮添加
            </div>
          </div>
        </div>

        <!-- ========== 编辑器设置 ========== -->
        <div v-else-if="settingsStore.activeTab === 'editor'" class="settings-panel">
          <h3>编辑器设置</h3>

          <div class="setting-group">
            <label>默认字体</label>
            <select
              :value="settingsStore.settings.editor.defaultFont"
              @change="settingsStore.settings.editor.defaultFont = ($event.target as HTMLSelectElement).value"
              class="select-input"
            >
              <option v-for="f in fontOptions" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>

          <div class="setting-group">
            <label>默认字号</label>
            <select
              :value="settingsStore.settings.editor.defaultFontSize"
              @change="settingsStore.settings.editor.defaultFontSize = Number(($event.target as HTMLSelectElement).value)"
              class="select-input"
            >
              <option v-for="s in fontSizeOptions" :key="s" :value="s">{{ s }}px</option>
            </select>
          </div>

          <div class="setting-group">
            <label>回复前缀</label>
            <Input
              :model-value="settingsStore.settings.editor.replyPrefix"
              @update:model-value="settingsStore.settings.editor.replyPrefix = $event"
              placeholder="On {{date}}, {{from}} wrote:"
            />
          </div>

          <div class="setting-group">
            <label>转发前缀</label>
            <Input
              :model-value="settingsStore.settings.editor.forwardPrefix"
              @update:model-value="settingsStore.settings.editor.forwardPrefix = $event"
              placeholder="---------- Forwarded message ----------"
            />
          </div>

          <div class="setting-group setting-row">
            <label>回复/转发时引用原文</label>
            <Switch v-model="settingsStore.settings.editor.quoteOriginal" />
          </div>
        </div>

        <!-- ========== 模板设置 ========== -->
        <div v-else-if="settingsStore.activeTab === 'templates'" class="settings-panel">
          <div class="panel-header">
            <h3>模板管理</h3>
            <Button variant="primary" size="sm" @click="openAddTemplate">
              <Icon name="plus" /> 新增模板
            </Button>
          </div>

          <div class="template-list">
            <div v-for="tpl in settingsStore.settings.templates" :key="tpl.id" class="item-card">
              <div class="item-info">
                <div class="item-name">{{ tpl.name }}</div>
                <div class="item-desc">
                  <span class="category-tag">{{ tpl.category }}</span>
                  {{ tpl.subject }}
                </div>
                <div class="variables">
                  变量:
                  <span v-for="v in tpl.variables" :key="v" class="var-tag">{{ v }}</span>
                </div>
              </div>
              <div class="item-actions">
                <Button variant="ghost" size="sm" @click="openEditTemplate(tpl)">编辑</Button>
                <Button variant="ghost" size="sm" @click="deleteTemplate(tpl.id)">删除</Button>
              </div>
            </div>
            <div v-if="settingsStore.settings.templates.length === 0" class="empty-state">
              暂无模板，点击上方按钮添加
            </div>
          </div>
        </div>

        <!-- ========== 快捷键设置 ========== -->
        <div v-else-if="settingsStore.activeTab === 'shortcuts'" class="settings-panel" @keydown="recordKeydown">
          <h3>快捷键</h3>
          <p class="hint">点击快捷键进行修改，按 ESC 取消</p>

          <div class="shortcut-list">
            <div v-for="sc in settingsStore.settings.shortcuts" :key="sc.id" class="shortcut-item">
              <div class="shortcut-info">
                <div class="shortcut-name">{{ sc.name }}</div>
                <div class="shortcut-desc">{{ sc.description }}</div>
              </div>

              <div v-if="editingShortcutId === sc.id" class="shortcut-edit">
                <div class="recording">
                  <span class="recording-dot"></span> 按下新的快捷键...
                </div>
                <div class="edit-actions">
                  <Button variant="primary" size="sm" @click="saveShortcut">保存</Button>
                  <Button variant="ghost" size="sm" @click="cancelEditShortcut">取消</Button>
                </div>
              </div>

              <button
                v-else
                class="shortcut-keys-display"
                @click="startEditShortcut(sc)"
              >
                <span v-if="sc.ctrl" class="key">Ctrl</span>
                <span v-if="sc.shift" class="key">Shift</span>
                <span v-if="sc.alt" class="key">Alt</span>
                <span class="key">{{ sc.key }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ========== AI设置 ========== -->
        <div v-else-if="settingsStore.activeTab === 'ai'" class="settings-panel">
          <h3>AI 设置</h3>

          <div class="setting-group setting-row">
            <label>启用 AI 助手</label>
            <Switch v-model="settingsStore.settings.ai.enabled" />
          </div>

          <div class="setting-group setting-row">
            <label>自动翻译</label>
            <Switch v-model="settingsStore.settings.ai.autoTranslate" />
          </div>

          <div class="setting-group setting-row">
            <label>显示 AI 操作栏</label>
            <Switch v-model="settingsStore.settings.ai.showActionBar" />
          </div>

          <div class="sub-section">
            <div class="panel-header">
              <h4>AI 模型配置</h4>
              <Button variant="primary" size="sm" @click="openAddModel">
                <Icon name="plus" /> 新增模型
              </Button>
            </div>

            <div class="model-list">
              <div v-for="m in settingsStore.settings.ai.modelConfigs" :key="m.id" class="item-card">
                <div class="item-info">
                  <div class="item-name">
                    {{ m.name }}
                    <span v-if="m.isDefault" class="badge-default">默认</span>
                  </div>
                  <div class="item-desc">{{ m.modelName }} @ {{ m.baseUrl }}</div>
                </div>
                <div class="item-actions">
                  <Button variant="ghost" size="sm" @click="openEditModel(m)">编辑</Button>
                  <Button
                    v-if="!m.isDefault"
                    variant="ghost"
                    size="sm"
                    @click="settingsStore.setDefaultModel(m.id)"
                  >设为默认</Button>
                  <Button variant="ghost" size="sm" @click="deleteModel(m.id)">删除</Button>
                </div>
              </div>
            </div>
          </div>

          <div class="sub-section">
            <div class="panel-header">
              <h4>知识库术语 (服装外贸)</h4>
              <Button variant="primary" size="sm" @click="openAddTerm">
                <Icon name="plus" /> 新增术语
              </Button>
            </div>

            <div class="term-list">
              <div v-for="term in settingsStore.settings.ai.knowledgeBase" :key="term.id" class="item-card">
                <div class="item-info">
                  <div class="item-name">{{ term.termCN }} / {{ term.termEN }}</div>
                  <div class="item-desc">
                    <span class="category-tag">{{ term.category }}</span>
                    {{ term.description }}
                  </div>
                  <div class="variables">
                    标签:
                    <span v-for="tag in term.tags" :key="tag" class="var-tag">{{ tag }}</span>
                  </div>
                </div>
                <div class="item-actions">
                  <Button variant="ghost" size="sm" @click="openEditTerm(term)">编辑</Button>
                  <Button variant="ghost" size="sm" @click="deleteTerm(term.id)">删除</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 账号编辑模态框 -->
    <Modal
      :model-value="showAccountModal"
      :title="editingItem ? '编辑账号' : '新增账号'"
      width="500px"
      @update:model-value="showAccountModal = $event"
    >
      <div class="modal-form">
        <div class="setting-group">
          <label>显示名称</label>
          <Input v-model="editingAccount.name" placeholder="例如：工作邮箱" />
        </div>
        <div class="setting-group">
          <label>邮箱地址</label>
          <Input v-model="editingAccount.email" type="email" placeholder="email@example.com" />
        </div>
        <div class="setting-group">
          <label>SMTP 服务器</label>
          <Input v-model="editingAccount.smtpHost" placeholder="smtp.example.com" />
        </div>
        <div class="setting-group">
          <label>SMTP 端口</label>
          <Input :model-value="editingAccount.smtpPort?.toString()" @update:model-value="editingAccount.smtpPort = $event ? Number($event) : undefined" type="text" placeholder="587" />
        </div>
        <div class="setting-group">
          <label>IMAP 服务器</label>
          <Input v-model="editingAccount.imapHost" placeholder="imap.example.com" />
        </div>
        <div class="setting-group">
          <label>IMAP 端口</label>
          <Input :model-value="editingAccount.imapPort?.toString()" @update:model-value="editingAccount.imapPort = $event ? Number($event) : undefined" type="text" placeholder="993" />
        </div>
        <div class="setting-group setting-row">
          <label>设为默认账号</label>
          <Switch v-model="editingAccount.isDefault" />
        </div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="showAccountModal = false">取消</Button>
        <Button variant="primary" @click="saveAccount">保存</Button>
      </template>
    </Modal>

    <!-- 模板编辑模态框 -->
    <Modal
      :model-value="showTemplateModal"
      :title="editingItem ? '编辑模板' : '新增模板'"
      width="600px"
      @update:model-value="showTemplateModal = $event"
    >
      <div class="modal-form">
        <div class="setting-group">
          <label>模板名称</label>
          <Input v-model="editingTemplate.name" placeholder="例如：询价回复" />
        </div>
        <div class="setting-group">
          <label>分类</label>
          <select
            :value="editingTemplate.category"
            @change="editingTemplate.category = ($event.target as HTMLSelectElement).value"
            class="select-input"
          >
            <option v-for="c in templateCategories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="setting-group">
          <label>邮件主题</label>
          <Input v-model="editingTemplate.subject" placeholder="回复：关于 {{产品名}} 的询价" />
        </div>
        <div class="setting-group">
          <label>邮件内容 (HTML)</label>
          <textarea
            :value="editingTemplate.content"
            @input="editingTemplate.content = ($event.target as HTMLTextAreaElement).value"
            class="textarea-input"
            rows="6"
            placeholder="<p>您好 {{客户名}}，</p>..."
          />
        </div>
        <div class="setting-group">
          <label>模板变量</label>
          <div class="input-row">
            <Input v-model="newTemplateVariable" placeholder="变量名，例如：客户名" @keyup.enter="addTemplateVariable" />
            <Button @click="addTemplateVariable">添加</Button>
          </div>
          <div class="tags-display">
            <span v-for="v in editingTemplate.variables" :key="v" class="tag-pill">
              {{ v }}
              <span class="tag-close" @click="removeTemplateVariable(v)">×</span>
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="showTemplateModal = false">取消</Button>
        <Button variant="primary" @click="saveTemplate">保存</Button>
      </template>
    </Modal>

    <!-- AI模型编辑模态框 -->
    <Modal
      :model-value="showModelModal"
      :title="editingItem ? '编辑模型' : '新增模型'"
      width="500px"
      @update:model-value="showModelModal = $event"
    >
      <div class="modal-form">
        <div class="setting-group">
          <label>配置名称</label>
          <Input v-model="editingModel.name" placeholder="例如：OpenAI GPT-4" />
        </div>
        <div class="setting-group">
          <label>API Base URL</label>
          <Input v-model="editingModel.baseUrl" placeholder="https://api.openai.com/v1" />
        </div>
        <div class="setting-group">
          <label>API Key</label>
          <Input v-model="editingModel.apiKey" type="password" placeholder="sk-..." />
        </div>
        <div class="setting-group">
          <label>Model Name</label>
          <Input v-model="editingModel.modelName" placeholder="gpt-4o" />
        </div>
        <div class="setting-group setting-row">
          <label>设为默认模型</label>
          <Switch v-model="editingModel.isDefault" />
        </div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="showModelModal = false">取消</Button>
        <Button variant="primary" @click="saveModel">保存</Button>
      </template>
    </Modal>

    <!-- 知识库术语编辑模态框 -->
    <Modal
      :model-value="showTermModal"
      :title="editingItem ? '编辑术语' : '新增术语'"
      width="500px"
      @update:model-value="showTermModal = $event"
    >
      <div class="modal-form">
        <div class="setting-group">
          <label>中文术语</label>
          <Input v-model="editingTerm.termCN" placeholder="例如：最小起订量" />
        </div>
        <div class="setting-group">
          <label>英文术语</label>
          <Input v-model="editingTerm.termEN" placeholder="例如：MOQ (Minimum Order Quantity)" />
        </div>
        <div class="setting-group">
          <label>分类</label>
          <select
            :value="editingTerm.category"
            @change="editingTerm.category = ($event.target as HTMLSelectElement).value"
            class="select-input"
          >
            <option value="贸易术语">贸易术语</option>
            <option value="价格术语">价格术语</option>
            <option value="支付方式">支付方式</option>
            <option value="服装术语">服装术语</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div class="setting-group">
          <label>描述</label>
          <textarea
            :value="editingTerm.description"
            @input="editingTerm.description = ($event.target as HTMLTextAreaElement).value"
            class="textarea-input"
            rows="3"
            placeholder="术语解释..."
          />
        </div>
        <div class="setting-group">
          <label>标签</label>
          <div class="input-row">
            <Input v-model="newTermTag" placeholder="标签名" @keyup.enter="addTermTag" />
            <Button @click="addTermTag">添加</Button>
          </div>
          <div class="tags-display">
            <span v-for="tag in editingTerm.tags" :key="tag" class="tag-pill">
              {{ tag }}
              <span class="tag-close" @click="removeTermTag(tag)">×</span>
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="showTermModal = false">取消</Button>
        <Button variant="primary" @click="saveTerm">保存</Button>
      </template>
    </Modal>

  </Modal>
</template>

<style scoped lang="scss">
.settings-content {
  display: flex;
  height: 550px;
  margin: -20px;
}

.settings-sidebar {
  width: 180px;
  padding: 20px;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
  flex-shrink: 0;
}

.settings-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.settings-panel {
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 16px;
  }
  h4 {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.setting-group {
  margin-bottom: 20px;
  label {
    display: block;
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-bottom: 6px;
  }
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-input,
.textarea-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }
}
.textarea-input {
  resize: vertical;
  font-family: inherit;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  background: var(--color-bg);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  gap: 8px;
  align-items: center;
}

.item-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.badge-default {
  font-size: 11px;
  padding: 2px 6px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
}

.category-tag {
  font-size: 12px;
  padding: 2px 8px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
}

.variables {
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-text-tertiary);
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.var-tag {
  padding: 2px 6px;
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--color-text-tertiary);
}

.sub-section {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.input-row {
  display: flex;
  gap: 8px;
}
.tags-display {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  font-size: 13px;
}
.tag-close {
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  opacity: 0.6;
  &:hover { opacity: 1; }
}

.shortcut-list {
  margin-top: 8px;
}
.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}
.shortcut-info {
  flex: 1;
}
.shortcut-name {
  font-weight: 500;
  color: var(--color-text);
}
.shortcut-desc {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
.shortcut-keys-display {
  display: flex;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 4px;
  border-radius: var(--radius-md);
  cursor: pointer;
  &:hover {
    background: var(--color-bg-secondary);
  }
}
.shortcut-edit {
  display: flex;
  align-items: center;
  gap: 12px;
}
.recording {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-error);
  font-weight: 500;
}
.recording-dot {
  width: 10px;
  height: 10px;
  background: var(--color-error);
  border-radius: 50%;
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.edit-actions {
  display: flex;
  gap: 6px;
}

.key {
  padding: 4px 8px;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.hint {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 12px;
}

.modal-form {
  padding: 4px 0;
}
</style>
