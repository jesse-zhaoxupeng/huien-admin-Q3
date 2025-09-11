<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

// Modal
import {
  Button,
  Descriptions,
  DescriptionsItem,
  Divider,
  message,
  Modal,
  Space,
} from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { auditParticipant, createIndication, updateIndication } from '#/api';

import { useSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<IndicationsApi.Indication>();
const mode = ref<string>('detail');
const getTitle = computed(() => {
  return '报名详情';
});

// 审核状态（0待初筛，1初筛通过，2初筛驳回，3入组通过，4入组驳回，5已脱落）
const auditStatusMap = {
  0: [
    {
      label: '缺少材料',
      danger: true,
      value: 6,
    },
    {
      label: '初筛驳回',
      danger: true,
      value: 2,
    },
    {
      label: '初筛通过',
      value: 1,
    },
  ],
  1: [
    {
      label: '入组驳回',
      danger: true,
      value: 4,
    },
    {
      label: '入组通过',
      value: 3,
    },
  ],
  2: [],
  3: [
    {
      label: '脱落',
      danger: true,
      value: 5,
    },
  ],
  4: [],
  5: [],
};

const onAudit = async (item) => {
  if ([2, 6].includes(item.value)) {
    formApi.updateSchema([
      {
        component: 'Textarea',
        componentProps: {
          minLength: 2,
          maxLength: 50,
          rows: 2,
          placeholder: '请输入驳回原因',
          showCount: true,
        },
        fieldName: 'rejected_reason',
        label: '驳回原因',
        rules: z
          .string({
            required_error: '请输入驳回原因',
          })
          .min(2, '驳回原因至少 2 个字符')
          .max(50, '驳回原因最多 50 个字符'),
      },
    ]);
  } else {
    formApi.updateSchema([
      {
        component: 'Textarea',
        componentProps: {
          minLength: 2,
          maxLength: 50,
          rows: 2,
          placeholder: '请输入驳回原因',
          showCount: true,
        },
        fieldName: 'rejected_reason',
        label: '驳回原因',
        rules: z.string().optional(),
      },
    ]);
  }
  const { valid } = await formApi.validate();

  if (valid) {
    Modal.confirm({
      title: '确认审核',
      content: `确认审核为【${item.label}】吗？`,
      onOk: async () => {
        const formValues = await formApi.getValues();

        const auditParticipantParams = {
          status: item.value,
          rejected_reason: formValues.rejected_reason,
        };
        await auditParticipant(formData.value.id, auditParticipantParams);
        message.success(`审核成功`);
        modalApi.close();
      },
    });
  }
};

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useSchema(),
  showDefaultActions: false,
});

const [DetailModal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = formApi.getValues();
      try {
        await (formData.value?.id
          ? updateIndication(formData.value.id, data)
          : createIndication(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<IndicationsApi.Indication>();
      console.info('data =>', data);
      if (data) {
        formData.value = data.row;
        mode.value = data.mode;
      }
    }
  },
});
</script>

<template>
  <DetailModal :title="getTitle" class="w-[800px]">
    <div>
      <!-- {{ formData }} -->
      <Descriptions
        title="报名信息"
        class="mb-4"
        :bordered="true"
        size="small"
        :label-style="{
          textAlign: 'right',
        }"
      >
        <DescriptionsItem label="姓名">{{ formData.name }}</DescriptionsItem>
        <DescriptionsItem label="手机号">
          {{ formData.referrer_phone }}
        </DescriptionsItem>
        <DescriptionsItem label="身份证号">
          {{ formData.id_card_no }}
        </DescriptionsItem>
        <DescriptionsItem label="民族">
          {{ formData.nationality }}
        </DescriptionsItem>
        <DescriptionsItem label="身高">
          {{ formData.height }} cm
        </DescriptionsItem>
        <DescriptionsItem label="体重">
          {{ formData.weight }} kg
        </DescriptionsItem>
        <DescriptionsItem label="BMI">
          {{
            (
              formData.weight /
              (((formData.height / 100) * formData.height) / 100)
            ).toFixed(2)
          }}
        </DescriptionsItem>
        <DescriptionsItem label="所属城市">
          {{ formData.province.cityname }} / {{ formData.city.cityname }}
        </DescriptionsItem>
        <DescriptionsItem label="报名时间">
          {{ formData.create_time }}
        </DescriptionsItem>
        <DescriptionsItem label="图片" :span="3" />
      </Descriptions>
      <Descriptions
        title="项目信息"
        class="mb-4"
        :bordered="true"
        size="small"
        :label-style="{
          textAlign: 'right',
          width: '90px',
        }"
      >
        <DescriptionsItem label="项目名称" :span="3">
          {{ formData.project.project_name }}
          <!-- <EllipsisText :max-width="560">
            {{ formData.project.project_name }}
          </EllipsisText> -->
        </DescriptionsItem>
        <DescriptionsItem label="项目类型">
          {{ formData.project.type.label }}
        </DescriptionsItem>
        <DescriptionsItem label="报名医院">
          {{ formData.hospital.name }}
        </DescriptionsItem>
        <DescriptionsItem label="性别要求">
          {{ formData.project.gender.label }}
        </DescriptionsItem>
        <DescriptionsItem label="项目分期">
          {{ formData.project.stage?.label }}
        </DescriptionsItem>
        <DescriptionsItem label="入组人数">
          {{ formData.applyed_hospital?.recruitment_count }}
        </DescriptionsItem>
        <DescriptionsItem label="体检时间">
          {{ formData.applyed_hospital?.checkup_date }}
          <!-- {{ formData.project.label }} -->
        </DescriptionsItem>
      </Descriptions>
      <Descriptions
        title="审核信息"
        class="mb-4"
        :bordered="false"
        size="small"
        :label-style="{
          textAlign: 'right',
        }"
      >
        <DescriptionsItem label="审核状态" :span="3">
          {{ formData.audit_status.label }}
        </DescriptionsItem>
        <DescriptionsItem label="驳回原因" :span="3">
          {{ formData.rejected_reason || '-' }}
        </DescriptionsItem>
      </Descriptions>
    </div>

    <div v-if="['0', '1', '3'].includes(formData.status)">
      <Divider orientation="left" dashed>审核表单</Divider>
      <Form />
    </div>

    <template #prepend-footer>
      <div class="flex-auto">
        <Space>
          <Button
            type="primary"
            @click="onAudit(item)"
            :key="item.value"
            :danger="item.danger"
            v-for="item in auditStatusMap[formData.status]"
          >
            {{ item.label }}
          </Button>
        </Space>
      </div>
    </template>
  </DetailModal>
</template>
