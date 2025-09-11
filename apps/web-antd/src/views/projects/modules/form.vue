<script lang="ts" setup>
import type { ProjectsApi } from '#/api';

// import { computed, onMounted, ref } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { Button, Divider } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createProject, updateProject } from '#/api';
import { $t } from '#/locales';

import { useSchema } from '../data';

import '@wangeditor/editor/dist/css/style.css'; // 引入 css

const emit = defineEmits(['success']);
const formData = ref<ProjectsApi.Project>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('projects.projects.project')])
    : $t('ui.actionTitle.create', [$t('projects.projects.project')]);
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useSchema(),
  wrapperClass: 'grid-cols-2',
  showDefaultActions: false,
});

function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}

//
const projectInfoEditorRef = shallowRef();
const inclusionCriteriaEditorRef = shallowRef();
const exclusionCriteriaEditorRef = shallowRef();

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
  // }, 1500);
});

const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  projectInfoEditorRef.value?.destroy();
  inclusionCriteriaEditorRef.value?.destroy();
  exclusionCriteriaEditorRef.value?.destroy();
});

const handleProjectInfoEditorCreated = (editor) => {
  projectInfoEditorRef.value = editor; // 记录 editor 实例，重要！
};

const handleExclusionCriteriaCreated = (editor) => {
  exclusionCriteriaEditorRef.value = editor; // 记录 editor 实例，重要！
};

const handleInclusionCriteriaCreated = (editor) => {
  inclusionCriteriaEditorRef.value = editor; // 记录 editor 实例，重要！
};

const [Modal, modalApi] = useVbenModal({
  class: 'w-[800px]',
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();

      data.project_info = projectInfoEditorRef.value.getHtml();
      data.inclusion_criteria = inclusionCriteriaEditorRef.value.getHtml();
      data.exclusion_criteria = exclusionCriteriaEditorRef.value.getHtml();

      try {
        await (formData.value?.id
          ? updateProject(formData.value.id, data)
          : createProject(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<ProjectsApi.Project>();
      if (data) {
        if (data.pid === 0) {
          data.pid = undefined;
        }
        // 确保报名表单模板有默认值
        if (!data.registrationFormCode) {
          data.registrationFormCode = 'STD-FORM';
        }
        formData.value = data;

        // valueHtml.value = data.project_info;
        formApi.setValues(formData.value);
      } else {
        // 如果是新建项目，设置默认的报名表单模板
        formApi.setFieldValue('registrationFormCode', 'STD-FORM');
      }
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />

    <Divider orientation="left" dashed>项目信息</Divider>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="projectInfoEditorRef"
        :default-config="toolbarConfig"
        mode="simple"
      />
      <Editor
        style="height: 305px; overflow-y: hidden"
        v-model="formData.project_info"
        :default-config="editorConfig"
        mode="simple"
        @on-created="handleProjectInfoEditorCreated"
      />
    </div>
    <Divider orientation="left" dashed>入选标准</Divider>

    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="inclusionCriteriaEditorRef"
        :default-config="toolbarConfig"
        mode="simple"
      />

      <Editor
        style="height: 305px; overflow-y: hidden"
        v-model="formData.inclusion_criteria"
        :default-config="editorConfig"
        mode="simple"
        @on-created="handleInclusionCriteriaCreated"
      />
    </div>
    <Divider orientation="left" dashed>排除标准</Divider>

    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="exclusionCriteriaEditorRef"
        :default-config="toolbarConfig"
        mode="simple"
      />
      <Editor
        style="height: 305px; overflow-y: hidden"
        v-model="formData.exclusion_criteria"
        :default-config="editorConfig"
        mode="simple"
        @on-created="handleExclusionCriteriaCreated"
      />
    </div>
    <template #prepend-footer>
      <div class="flex-auto">
        <Button type="primary" danger @click="resetForm">
          {{ $t('common.reset') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
