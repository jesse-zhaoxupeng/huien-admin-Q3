<script lang="ts" setup>
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Tabs, message, Modal, Form, Input, Radio, InputNumber, Select, Checkbox, Tag } from 'ant-design-vue';

// 预设的表单模板数据
const formTemplates = [
  {
    id: '1',
    code: 'STD-FORM',
    name: '标准报名表单',
    description: '包含基本个人信息、联系方式和健康状况',
    fields: [
      { name: 'name', label: '姓名', type: 'input', required: true },
      { name: 'gender', label: '性别', type: 'radio', options: ['男', '女'], required: true },
      { name: 'age', label: '年龄', type: 'number', required: true },
      { name: 'phone', label: '手机号', type: 'input', required: true },
      { name: 'idCard', label: '身份证号', type: 'input', required: true },
      { name: 'address', label: '家庭住址', type: 'textarea', required: true },
      { name: 'healthStatus', label: '健康状况', type: 'radio', options: ['良好', '一般', '较差'], required: true },
      { name: 'medicalHistory', label: '既往病史', type: 'textarea', required: false },
    ]
  },
  {
    id: '2',
    code: 'SIMPLE-FORM',
    name: '简易报名表单',
    description: '仅包含基本信息，适用于初步筛选',
    fields: [
      { name: 'name', label: '姓名', type: 'input', required: true },
      { name: 'gender', label: '性别', type: 'radio', options: ['男', '女'], required: true },
      { name: 'age', label: '年龄', type: 'number', required: true },
      { name: 'phone', label: '手机号', type: 'input', required: true },
      { name: 'healthStatus', label: '健康状况', type: 'radio', options: ['良好', '一般', '较差'], required: true },
    ]
  },
  {
    id: '3',
    code: 'HEALTH-FORM',
    name: '详细健康表单',
    description: '包含详细的健康信息和病史调查',
    fields: [
      { name: 'name', label: '姓名', type: 'input', required: true },
      { name: 'gender', label: '性别', type: 'radio', options: ['男', '女'], required: true },
      { name: 'age', label: '年龄', type: 'number', required: true },
      { name: 'phone', label: '手机号', type: 'input', required: true },
      { name: 'idCard', label: '身份证号', type: 'input', required: true },
      { name: 'height', label: '身高(cm)', type: 'number', required: true },
      { name: 'weight', label: '体重(kg)', type: 'number', required: true },
      { name: 'bloodType', label: '血型', type: 'select', options: ['A型', 'B型', 'AB型', 'O型', '不详'], required: false },
      { name: 'allergies', label: '是否有过敏史', type: 'radio', options: ['有', '无'], required: true },
      { name: 'allergiesDesc', label: '过敏史描述', type: 'textarea', required: false, conditional: { field: 'allergies', value: '有' } },
      { name: 'chronicDiseases', label: '慢性病情况', type: 'checkbox', options: ['高血压', '糖尿病', '心脏病', '肝病', '肾病', '其他'], required: false },
      { name: 'medicationHistory', label: '用药史', type: 'textarea', required: false },
      { name: 'familyHistory', label: '家族病史', type: 'textarea', required: false },
    ]
  }
];

// 获取字段类型显示颜色
const getTypeColor = (type) => {
  const typeColorMap = {
    'input': 'blue',
    'textarea': 'purple',
    'number': 'cyan',
    'radio': 'orange',
    'checkbox': 'magenta',
    'select': 'green',
  };
  return typeColorMap[type] || 'default';
};

// 当前选中的表单模板
const activeTemplateId = ref('1');

// 切换标签页
const onTabChange = (key: string) => {
  activeTemplateId.value = key;
};

// 获取当前表单模板
const getCurrentTemplate = () => {
  return formTemplates.find(template => template.id === activeTemplateId.value);
};

// 预览表单
const previewForm = () => {
  const template = getCurrentTemplate();
  if (template) {
    previewVisible.value = true;
    previewingTemplate.value = template;
  } else {
    message.error('未找到模板');
  }
};

// 预览窗口控制
const previewVisible = ref(false);
const previewingTemplate = ref<typeof formTemplates[0] | null>(null);

// 关闭预览窗口
const closePreview = () => {
  previewVisible.value = false;
  previewingTemplate.value = null;
};

// 导出表单配置
const exportFormConfig = () => {
  const template = getCurrentTemplate();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${template?.name}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  message.success('表单配置已导出');
};
</script>

<template>
  <Page>
    <div class="p-4">
      <Card title="报名表单模板管理" class="mb-4">
        <p>本页面用于管理受试者报名表单模板，您可以预览、导出或在项目中使用这些模板。</p>
      </Card>
      
      <Tabs v-model:activeKey="activeTemplateId" @change="onTabChange" type="card">
        <Tabs.TabPane v-for="template in formTemplates" :key="template.id" :tab="template.name">
          <Card :bordered="false" class="mb-4 form-template-card">
            <template #title>
              <div class="flex items-center">
                <span class="mr-2">{{ template.description }}</span>
                <Tag color="processing" class="code-tag">{{ template.code }}</Tag>
              </div>
            </template>
            <div class="mb-4 flex space-x-4">
              <Button type="primary" @click="previewForm">预览表单</Button>
              <Button @click="exportFormConfig">导出配置</Button>
            </div>
            <div class="template-info">
              <div class="info-item">
                <div class="info-label">表单代号</div>
                <div class="info-value">{{ template.code }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">字段数量</div>
                <div class="info-value">{{ template.fields.length }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">必填字段</div>
                <div class="info-value">{{ template.fields.filter(f => f.required).length }}</div>
              </div>
            </div>
          </Card>
          
          <Card title="字段配置" :bordered="false" class="form-template-card">
            <div class="field-table-container">
              <table class="w-full field-table">
                <thead>
                  <tr>
                    <th>字段名</th>
                    <th>标签</th>
                    <th>类型</th>
                    <th>必填</th>
                    <th>选项/条件</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(field, index) in template.fields" :key="index" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
                    <td><div class="code-style">{{ field.name }}</div></td>
                    <td>{{ field.label }}</td>
                    <td>
                      <Tag :color="getTypeColor(field.type)">{{ field.type }}</Tag>
                    </td>
                    <td>
                      <Tag :color="field.required ? 'error' : 'default'">
                        {{ field.required ? '是' : '否' }}
                      </Tag>
                    </td>
                    <td>
                      <div v-if="field.options" class="options-container">
                        <Tag v-for="option in field.options" :key="option" class="m-1">
                          {{ option }}
                        </Tag>
                      </div>
                      <div v-if="field.conditional" class="mt-1 text-secondary">
                        条件: {{ field.conditional.field }}={{ field.conditional.value }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
    
    <!-- 表单预览模态框 -->
    <Modal 
      v-model:visible="previewVisible" 
      title="表单预览" 
      width="800px"
      :footer="null"
      @cancel="closePreview"
      class="form-preview-modal"
    >
      <div v-if="previewingTemplate">
        <div class="flex items-center mb-2">
          <h2 class="text-lg font-bold mr-2">{{ previewingTemplate.name }}</h2>
          <Tag color="processing" class="code-tag">{{ previewingTemplate.code }}</Tag>
        </div>
        <p class="text-secondary mb-6">{{ previewingTemplate.description }}</p>
        
        <Form layout="vertical">
          <div v-for="field in previewingTemplate.fields" :key="field.name">
            <Form.Item 
              :label="field.label" 
              :name="field.name"
              :rules="field.required ? [{ required: true, message: `请${field.type === 'select' ? '选择' : '输入'}${field.label}!` }] : []"
            >
              <!-- 根据字段类型渲染不同的表单控件 -->
              <template v-if="field.type === 'input'">
                <Input :placeholder="`请输入${field.label}`" />
              </template>
              <template v-else-if="field.type === 'textarea'">
                <Input.TextArea :placeholder="`请输入${field.label}`" :rows="4" />
              </template>
              <template v-else-if="field.type === 'number'">
                <InputNumber :placeholder="`请输入${field.label}`" style="width: 100%" />
              </template>
              <template v-else-if="field.type === 'radio'">
                <Radio.Group>
                  <Radio v-for="option in field.options" :key="option" :value="option">{{ option }}</Radio>
                </Radio.Group>
              </template>
              <template v-else-if="field.type === 'checkbox'">
                <Checkbox.Group>
                  <Checkbox v-for="option in field.options" :key="option" :value="option">{{ option }}</Checkbox>
                </Checkbox.Group>
              </template>
              <template v-else-if="field.type === 'select'">
                <Select :placeholder="`请选择${field.label}`" style="width: 100%">
                  <Select.Option v-for="option in field.options" :key="option" :value="option">{{ option }}</Select.Option>
                </Select>
              </template>
            </Form.Item>
          </div>
          
          <div class="mt-6 text-center">
            <Button type="primary" class="mr-4">提交表单</Button>
            <Button @click="closePreview">关闭预览</Button>
          </div>
        </Form>
      </div>
    </Modal>
  </Page>
</template> 

<style scoped>
.form-template-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-tag {
  font-family: monospace;
  font-weight: bold;
}

.template-info {
  display: flex;
  gap: 32px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

:deep(.dark) .template-info {
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-label {
  font-size: 12px;
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.dark) .info-label {
  color: rgba(255, 255, 255, 0.45);
}

.info-value {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
}

.field-table-container {
  overflow-x: auto;
}

.field-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.field-table th,
.field-table td {
  padding: 12px 16px;
  border: none;
  text-align: left;
}

.field-table th {
  background-color: #f5f7fa;
  font-weight: 500;
  color: #1f2329;
}

:deep(.dark) .field-table th {
  background-color: rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 0.85);
}

.field-table .even-row {
  background-color: #ffffff;
}

.field-table .odd-row {
  background-color: #f5f7fa;
}

:deep(.dark) .field-table .even-row {
  background-color: rgba(255, 255, 255, 0.04);
}

:deep(.dark) .field-table .odd-row {
  background-color: rgba(0, 0, 0, 0.15);
}

.code-style {
  font-family: monospace;
  background-color: rgba(24, 144, 255, 0.1);
  padding: 3px 6px;
  border-radius: 4px;
  color: #1890ff;
}

:deep(.dark) .code-style {
  background-color: rgba(0, 0, 0, 0.2);
}

.options-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.text-secondary {
  color: rgba(0, 0, 0, 0.65);
}

:deep(.dark) .text-secondary {
  color: rgba(255, 255, 255, 0.65);
}

:deep(.ant-tabs-card) > .ant-tabs-nav .ant-tabs-tab {
  border: none;
  border-radius: 4px 4px 0 0;
  background-color: #f5f7fa;
  transition: all 0.3s;
}

:deep(.dark) :deep(.ant-tabs-card) > .ant-tabs-nav .ant-tabs-tab {
  background-color: rgba(255, 255, 255, 0.04);
}

:deep(.ant-tabs-card) > .ant-tabs-nav .ant-tabs-tab-active {
  background-color: rgba(24, 144, 255, 0.1);
  border-bottom: 2px solid #1890ff;
}

:deep(.form-preview-modal .ant-modal-content) {
  border-radius: 8px;
}

/* 美化字段行，添加悬停效果 */
.field-table tbody tr {
  transition: all 0.3s;
}

.field-table tbody tr:hover {
  background-color: rgba(24, 144, 255, 0.05);
}

:deep(.dark) .field-table tbody tr:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

/* 表格行分隔 */
.field-table td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

:deep(.dark) .field-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.field-table tr:last-child td {
  border-bottom: none;
}
</style> 
