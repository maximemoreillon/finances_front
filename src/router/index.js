import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
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
    path: '/transaction_categories/:category_id',
    name: 'transaction_category',
    component: () => import('../views/TransactionCategory.vue')
  },
  {
    path: '/balance',
    name: 'balance',
    component: () => import('../views/BalanceHistory.vue')
  },
  {
    path: '/register_balance',
    name: 'register_balance',
    component: () => import('../views/RegisterBalance.vue')
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../views/Transactions.vue')
  },

  {
    path: '/view_transaction',
    name: 'view_transaction',
    component: () => import('../views/ViewTransaction.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
