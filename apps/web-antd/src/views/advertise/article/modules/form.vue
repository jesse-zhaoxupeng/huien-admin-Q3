<script lang="ts" setup>
import type { AdImageApi, ArticleApi } from '#/api';

import { computed, ref, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { Button, Divider, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createArticle, updateArticle } from '#/api';
import { $t } from '#/locales';

import { useSchema } from '../data';

// 引入 css
import '@wangeditor/editor/dist/css/style.css';

const emit = defineEmits(['success']);
const formData = ref<ArticleApi.upDataFetchParams>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['文章'])
    : $t('ui.actionTitle.create', ['文章']);
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
const articleInfoEditorRef = shallowRef();
const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };
const handleArticleInfoEditorCreated = (editor: any) => {
  articleInfoEditorRef.value = editor; // 记录 editor 实例，重要！
};
const [Modal, modalApi] = useVbenModal({
  class: 'w-[800px]',
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data: ArticleApi.upDataFetchParams = await formApi.getValues();
      data.articleContent = articleInfoEditorRef.value.getHtml();
      const params = {
        ...data,
        frontImg: data.files[0].response.url,
      };
      try {
        await (formData.value?.id
          ? updateArticle({ ...params, id: formData.value?.id })
          : createArticle(params));
        modalApi.close();
        message.success(
          formData.value?.id
            ? $t('ui.actionTitle.edit', ['文章成功'])
            : $t('ui.actionTitle.create', ['文章成功']),
        );
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<AdImageApi.AdImage>();
      if (data) {
        if (data.pid === 0) {
          data.pid = undefined;
        }
        const formattedFiles = [
          {
            name: '',
            status: 'done',
            type: '',
            url: data.frontImg,
            response: { url: data.frontImg },
            thumbUrl: data.frontImg,
            uid: data.id,
          },
        ];

        formData.value = data;
        formApi.setValues({
          ...formData.value,
          files: data.frontImg ? formattedFiles : null,
        });
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
        :editor="articleInfoEditorRef"
        :default-config="toolbarConfig"
        mode="simple"
      />
      <Editor
        style="height: 305px; overflow-y: hidden"
        v-model="formData.articleContent"
        :default-config="editorConfig"
        mode="simple"
        @on-created="handleArticleInfoEditorCreated"
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
