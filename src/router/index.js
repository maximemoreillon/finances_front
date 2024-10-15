import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/accounts",
    name: "accounts",
    alias: "/",
    component: () => import("../views/Accounts.vue"),
  },

  {
    path: "/accounts/:accountId",
    name: "account",
    component: () => import("../views/Account.vue"),
  },

  {
    path: "/accounts/:accountId/balance/register",
    name: "register_balance",
    component: () => import("../views/RegisterBalance.vue"),
  },
  {
    path: "/accounts/:accountId/transactions/:transactionId",
    name: "transaction",
    component: () => import("../views/transactions/Transaction.vue"),
  },
  // {
  //   path: "balance",
  //   name: "balance",
  //   component: () => import("../views/BalanceHistory.vue"),
  // },

  // Categories
  {
    path: "/transaction_categories",
    name: "transaction_categories",
    component: () => import("../views/categories/TransactionCategories.vue"),
  },
  {
    path: "/transaction_categories/new",
    name: "new_transaction_category",
    component: () => import("../views/categories/NewTransactionCategory.vue"),
  },
  {
    path: "/transaction_categories/:categoryId",
    name: "transaction_category",
    component: () => import("../views/categories/TransactionCategory.vue"),
  },

  // {
  //   path: '/accounts/:account/transactions',
  //   name: 'transactions',
  //   component: () => import('../views/unused/Transactions.vue')
  // },
  // {
  //   path: "/accounts/:account/monthlytransactions",
  //   name: "monthly_transactions",
  //   component: () => import("../views/MonthlyExpenses.vue"),
  // },

  // Misc
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
