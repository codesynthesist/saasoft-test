<template>
  <fieldset class="form-account">
    <textarea
      v-model.trim="formData.label"
      rows="2"
      class="form-control"
      :class="{ 'form-control--error': formErrors['label'] }"
      @blur="onBlur"
    />

    <select
      v-model="formData.type"
      class="form-control"
      :class="{ 'form-control--error': formErrors['type'] }"
      @change="onChangeType"
    >
      <option
        v-for="option of options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <div class="form-account__flexible"
         :class="{ 'form-account__flexible--full': formData.type === AccountTypes.LDAP }">
      <input
        v-model.trim="formData.login"
        type="text"
        class="form-control"
        :class="{ 'form-control--error': formErrors['login'] }"
        @blur="onBlur"
      >
      <input
        v-if="formData.type !== AccountTypes.LDAP"
        v-model.trim="formData.password"
        type="password"
        class="form-control"
        :class="{ 'form-control--error': formErrors['password'] }"
        @blur="onBlur"
      >
    </div>
    <button
      type="button"
      class="form-account__remove-button"
      @click="emit('removeAccount', props.id)"
    >
      🗙
    </button>
  </fieldset>
</template>

<script setup lang="ts">
import { AccountTypes, IAccount } from '@/stores/accounts'
import { ref, reactive, toRaw, defineProps, defineEmits } from 'vue'

type TypeOption = { label: string; value: AccountTypes };
type FormData = Omit<IAccount, 'id' | 'label' | 'password'> & {
  label: string;
  password: string;
}
type FormErrors = Partial<Record<keyof FormData, boolean>>;

type Rule = {
  required: boolean;
  max?: number;
  // min: number;
}

type Rules<T> = {
  [key in keyof T]?: Rule
}

const options: TypeOption[] = [
  {
    label: 'Локальная',
    value: AccountTypes.LOCAL
  },
  {
    label: 'LDAP',
    value: AccountTypes.LDAP
  }
]

interface Emits {
  'update-account': (account: IAccount) => void;
  'remove-account': (id: string) => void;
}

const props = defineProps<IAccount>()
const emit = defineEmits<Emits>()

const formData = reactive<FormData>({
  label: props.label.map(i => i.text).join('; '),
  type: props.type,
  login: props.login,
  password: props.password === null ? '' : props.password
})

const formRules = reactive<Rules<FormData>>({
  label: {
    required: false,
    max: 50
  },
  type: {
    required: true
  },
  login: {
    required: true,
    max: 100
  },
  password: {
    required: true,
    max: 100
  }
})
const formErrors = ref<FormErrors>({})

// Можно из этого сделать универсальный композабл, если форма не одна
const checkValidate = () => {
  const errors: FormErrors = {}

  formErrors.value = {}

  // предполагаем что все значения инпутов - строки, как здесь
  for (const field of Object.keys(formData) as (keyof FormData)[]) {
    const value: string | null = formData[field]
    const rule: Rule | undefined = formRules[field]

    if (!rule) {
      continue
    }

    if (value.length === 0 && rule.required) {
      errors[field] = true
      continue
    }

    if (rule.max && (value.length > rule.max)) {
      errors[field] = true
    }
  }

  if (Object.keys(errors).length > 0) {
    formErrors.value = errors

    return false
  }

  return true
}

const onChangeType = () => {
  if (formData.type === AccountTypes.LDAP) {
    formData.password = ''
    formRules.password.required = false
  } else {
    formRules.password.required = true
  }
}

const onBlur = () => {
  if (checkValidate()) {
    prepareAndSaveAccount()
  }
}

const prepareAndSaveAccount = () => {
  const account: IAccount = {
    id: props.id,
    ...toRaw(formData),
    label: formData.label.split('; ').filter((i) => i.length).map((i) => ({ text: i.trim() })),
    password: formData.type === AccountTypes.LDAP ? null : formData.password
  }

  emit('update-account', account)
}

</script>

<style scoped lang="scss">
.form-account {
  display: grid;
  grid-template-columns: 200px 200px 1fr 30px;
  gap: 10px;
  margin-bottom: 10px;
  border: 0;

  &__remove-button {
    border: none;
    background: none;
    color: red;
    font-weight: 800;
    cursor: pointer;
    line-height: 19px;
    vertical-align: middle;
  }

  &__flexible {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 10px;

    &--full {
      grid-template-columns: 1fr;
    }
  }
}

.form-control {
  padding: 3px 5px;
  align-self: start;
  height: 38px;

  &:is(textarea) {
    resize: none;
  }

  &--error {
    border-color: red;
  }
}
</style>
