<template>
  <section class="accounts">
    <header class="accounts__header">
      <h2>Учетные записи</h2>
      <button
        type="button"
        class="accounts__add-button"
        @click="addAccount"
      >+
      </button>
    </header>

    <div class="accounts__banner">
      Для указания нескольких меток для одной пары логин\пароль используйте разделитель <b>;</b>
    </div>

    <main>
      <section class="form">
        <header class="form__header">
          <div>Метки</div>
          <div>Тип записи</div>
          <div>Логин</div>
          <div>Пароль</div>
          <div></div>
        </header>

        <main class="form__body">
            <AccountItem
              v-for="account of accounts"
              :key="account.id"
              :id="account.id"
              :label="account.label"
              :type="account.type"
              :login="account.login"
              :password="account.password"
              @update-account="updateAccount"
              @remove-account="removeAccount"
            />
        </main>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import AccountItem from '@/components/AccountItem.vue'
import { useAccountStore } from '@/stores/accounts'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const accountsStore = useAccountStore()
const { accounts } = storeToRefs(accountsStore)
const { addAccount, removeAccount, updateAccount, loadFromCache } = accountsStore

onMounted(() => {
  loadFromCache()
})
</script>

<style scoped lang="scss">
.accounts {
  margin: 0 auto;
  max-width: 960px;

  &__header {
    display: flex;
    align-items: center;
    margin: 30px 0;

    h2 {
      margin-right: 10px;
    }
  }

  &__banner {
    padding: 5px;
    background-color: #eee;
    margin-bottom: 30px;

    &:before {
      content: '?';
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 12px;
      padding: 2px;
      margin-right: 3px;
      border: 1px solid #000;
      border-radius: 100%;
      font-weight: 600;
    }
  }

  &__add-button {
    width: 40px;
    height: 40px;
    font-size: 20px;
    cursor: pointer;
  }
}

.form__header {
  display: grid;
  grid-template-columns: 200px 200px 1fr 200px 30px;
  gap: 10px;
  color: #aaa;
  margin-bottom: 5px;
}

</style>
