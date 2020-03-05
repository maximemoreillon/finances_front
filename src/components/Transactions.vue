<template>
  <div class="">

    <div v-if="dataCollection.loaded">
      <DoughnutChart v-bind:data="dataCollection"/>


      <table>
        <th>Date</th>
        <th class="description_column_header">Description</th>
        <th></th>
        <th>Amount</th>

        <tr
        v-for="(transaction, index) in transactions"
        v-bind:key="index"
        v-on:click="$router.push({ path: 'view_transaction', query: { _id: transaction._id } })">
          <td>{{format_date(transaction.date)}}</td>
          <td>{{transaction.description}}</td>
          <td v-if="transaction.business_expense">💼</td>
          <td v-else></td>
          <td class="amount_cell">{{transaction.amount}}</td>
        </tr>
      </table>
    </div>

    <Loader v-else/>

  </div>
</template>

<script>
// @ is an alias to /src
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import Loader from '@/components//Loader.vue'

export default {
  name: 'Transactions',
  components: {
    DoughnutChart,
    Loader
  },
  props: {
    account: String
  },
  data(){
    return {

      transactions: [],

      // Find a way to privatize this!
      expense_categories : [
        {label: "eBay", keywords: ["ＰＡＹＰＡＬ"]},
        {label: "Credit card", keywords: ["ﾄﾖﾀﾌｱｲﾅﾝｽ"]},
        {label: "Cash withdrawal", keywords: ["カード", "ﾀｺｳ　(0040-125)"]},
        {label: "Water", keywords: ["送金　IB ﾕ.ｶﾒｼﾞﾏ"]},
        {label: "Kick boxing", keywords: ["振替　MBS.BARBOSAJ"]},
        {label: "Internet", keywords: ["ソフトバンク（Ｂ）"]},
        {label: "Electricity", keywords: ["中部電力"]},
        {label: "Phone", keywords: ["日本通信ｂモバイルサービス"]},
        {label: "Gas", keywords: ["東邦ガス　ガス料金"]},
        {label: "LINE Pay", keywords: ["ﾗｲﾝﾍﾟｲ"]},
      ],

      dataCollection: {
        loaded: false,
        labels: [], // Filled by API call
        datasets: [
          {
            label: 'Transactions',
            data: [], // Filled by API call
            backgroundColor: [
              '#c00000', '#aaaaaa', '#bf6d6d', '#444444', '#9e3434', '#dddddd','#c00000',
              '#aaaaaa', '#bf6d6d', '#444444', '#9e3434', '#dddddd','#c00000', '#aaaaaa',
              '#bf6d6d', '#444444', '#9e3434', '#dddddd','#c00000', '#aaaaaa', '#bf6d6d',
              '#444444', '#9e3434', '#dddddd'],
          }
        ],
      }
    }
  },
  mounted(){

    this.dataCollection.loaded = false;

    this.axios.post("https://finances.maximemoreillon.com/transactions", {account: this.account})
    .then( response => {


      // Dealing with data for the list
      this.transactions = response.data

      var dataframe_temp = []

      // Processing data for chart
      this.transactions.forEach(transaction => {

        // Only plot transaction if not ignored
        // and only take expenses (negative)
        if(!transaction.business_expense && transaction.amount < 0){
          // Check what category the expense belongs to from its description
          // If no category found, category is the description
          var category = null;
          this.expense_categories.forEach(expense_category => {
            expense_category.keywords.forEach(keyword => {
              if(transaction.description.includes(keyword)){
                category = expense_category.label;
              }
            })
          })

          if(!category) category = transaction.description;

          // Check if data already exists for the given category
          // if so, add data to sum
          // if not, create a label
          var label_already_exists = false;
          dataframe_temp.forEach((entry, index) => {
            if(entry.category === category) {
              label_already_exists = true;
              dataframe_temp[index].amount += Math.abs(transaction.amount)
            }
          })


          // The label does not already exist so create it and add data for its index
          if(!label_already_exists){
            dataframe_temp.push({
              category: category,
              amount: Math.abs(transaction.amount)
            })
          }
        }
      })

      // Sorting
      dataframe_temp.sort(function (a, b) {
        return b.amount - a.amount;
      });

      // grouping small items as "other"
      var spliced = dataframe_temp.splice(8);
      if(spliced.length > 0){
        dataframe_temp.push({
          category: 'other',
          amount: spliced.map(item => item.amount).reduce((a, b) => a + b)
        })
      }


      this.dataCollection.labels = dataframe_temp.map(x => x.category)
      this.dataCollection.datasets[0].data = dataframe_temp.map(x => x.amount)


      this.dataCollection.loaded = true;
    })
  },
  methods: {
    format_date(date){

      var options = {year: '2-digit', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleString('ja-JP', options)


    }
  }

}
</script>

<style scoped>

.chart{
  outline: 1px solid red;
  height: 300px;
  width: 50%;
}

table {
  width: 100%;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
  table-layout: fixed;
}

td:first-child {
  width: 20%;
}

.description_column_header{
  width: 65%;
}

td:last-child {
  width: 15%;
  text-align: right;
}

td, th {
  padding: 2px;

  white-space: nowrap;

}

td:not(.amount_cell){
  overflow: hidden;
  text-overflow: ellipsis;
}

tr:not(:first-child){
  border-top: 1px solid #dddddd;
  transition: background-color 0.25s;
  cursor: pointer;
}

tr:not(:first-child):hover{
  background-color: #eeeeee;
}

</style>
