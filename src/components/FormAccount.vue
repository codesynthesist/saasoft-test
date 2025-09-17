<template>
  <fieldset class="form-account">
    <textarea type="text" rows="1"></textarea>

    <select>
      <option
        v-for="option of options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <input type="text">
    <input type="password">
    <button type="button" class="form-account__remove-button">
      🗙
    </button>
  </fieldset>
</template>

<script setup lang="ts">
import { AccountTypes } from '@/stores/accounts'

type TypeOption = { label: string; value: AccountTypes };

const options: TypeOption[] = [
  {
    label: 'Локальная',
    value: AccountTypes.local
  },
  {
    label: 'LDAP',
    value: AccountTypes.ldap
  }
]
</script>

<style scoped lang="scss">
.form-account {
  display: grid;
  grid-template-columns: 200px 200px 1fr 200px 30px;
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
}
</style>
