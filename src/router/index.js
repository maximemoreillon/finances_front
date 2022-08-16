import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('../views/Accounts.vue'),
    alias: '/'
  },
  {
    path: '/accounts/:account',
    name: 'account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/accounts/:account/balance/register',
    name: 'register_balance',
    component: () => import('../views/RegisterBalance.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/transaction_categories',
    name: 'transaction_categories',
    component: () => import('../views/TransactionCategories.vue')
  },
  {
    path: '/transaction_categories/new',
    name: 'new_transaction_category',
    component: () => import('../views/NewTransactionCategory.vue')
  },
  {
    path: '/transaction_categories/:category_id',
    name: 'transaction_category',
    component: () => import('../views/TransactionCategory.vue')
  },


  {
    path: '/accounts/:account/balance',
    name: 'balance',
    component: () => import('../views/BalanceHistory.vue')
  },
  {
    path: '/accounts/:account/transactions',
    name: 'transactions',
    component: () => import('../views/Transactions.vue')
  },
  {
    // Is this even used?
    path: '/accounts/:account/monthlytransactions',
    name: 'monthly_transactions',
    component: () => import('../views/MonthlyExpenses.vue')
  },
  {

    path: '/accounts/:account/transactions/:transaction_id',
    name: 'transaction',
    component: () => import('../views/Transaction.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
