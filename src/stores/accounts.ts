import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum AccountTypes {
  ldap,
  local,
}

type LabelItem = { text: string };

interface IAccount {
  id: string; // for :key needed
  label?: LabelItem[],
  type: AccountTypes,
  login: string,
  password: string,
}

export const useAccountStore = defineStore('accounts-form', () => {
  const accounts = ref<IAccount[]>([])

  const addAccount = (): void => {
    accounts.value.push({
      id: (new Date()).toISOString(),
      label: [],
      type: AccountTypes.local,
      login: '',
      password: ''
    })
  }

  const removeAccount = (id: string): void => {
    accounts.value = accounts.value.filter((i) => i.id !== id)
  }

  return {
    accounts,
    addAccount,
    removeAccount
  }
})
