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
    path: "/transactions",
    name: "transactions",
    component: () => import("../views/transactions/Transactions.vue"),
  },
  {
    path: "/transactions/:transactionId",
    name: "transaction",
    component: () => import("../views/transactions/Transaction.vue"),
  },

  // Categories
  {
    path: "/transaction_categories",
    name: "transaction_categories",
    component: () => import("../views/categories/TransactionCategories.vue"),
  },

  {
    path: "/transaction_categories/:categoryId",
    name: "transaction_category",
    component: () => import("../views/categories/TransactionCategory.vue"),
  },

  {
    path: "/keywords/:keywordId",
    name: "keyword",
    component: () => import("../views/keywords/Keyword.vue"),
  },

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
