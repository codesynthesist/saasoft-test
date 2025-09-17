import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum AccountTypes {
  LDAP = 'ldap',
  LOCAL = 'local',
}

type LabelItem = { text: string };

export interface IAccount {
  id: string; // для :key
  label: LabelItem[], // необзателен лишь для формы, но по дефолту пустой массив
  type: AccountTypes,
  login: string,
  password: string | null,
}

const LS_KEY = 'accounts'

export const useAccountStore = defineStore('accounts-form', () => {
  const accounts = ref<IAccount[]>([])

  const addAccount = (): void => {
    accounts.value.push({
      id: Date.now().toString(),
      label: [],
      type: AccountTypes.LOCAL,
      login: '',
      password: ''
    })
  }

  const updateAccount = (account: IAccount): void => {
    const index = accounts.value.findIndex(a => a.id === account.id)

    accounts.value.splice(index, 1, account)
    saveToCache()
  }

  const removeAccount = (id: string): void => {
    accounts.value = accounts.value.filter(i => i.id !== id)
  }

  const saveToCache = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(accounts.value))
  }

  const loadFromCache = (): void => {
    const lsAccounts = localStorage.getItem(LS_KEY)

    if (lsAccounts) {
      accounts.value = JSON.parse(lsAccounts)
    }
  }

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    loadFromCache
  }
})
