<template>
  <div>
    <h1>Categorias</h1>

    <vs-row>
      <vs-col vs-w="3" vs-xs="1"></vs-col>
      <vs-col vs-w="6" vs-xs="10">
        <vs-table
          :sst="true"
          :data="items"
        >
          <template slot="header">
            <h3>Categorias</h3>
            <router-link :to="{ name: 'categorias.create' }">
              <vs-button color="primary" type="border" icon="add"></vs-button>
            </router-link>
          </template>
          <template slot="thead">
            <vs-th>ID</vs-th>
            <vs-th>Descrição</vs-th>
            <vs-th>Data de Criação</vs-th>
            <vs-th>Data de Atualização</vs-th>
            <vs-th>Produtos</vs-th>
            <vs-th>Ações</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="data[indextr].id">{{data[indextr].id}}</vs-td>

              <vs-td :data="data[indextr].descricao">{{data[indextr].descricao}}</vs-td>

              <vs-td :data="data[indextr].created_at">{{data[indextr].created_at | formatDate }}</vs-td>
              <vs-td :data="data[indextr].updated_at">{{data[indextr].updated_at | formatDate }}</vs-td>
              <vs-td :data="data[indextr].produtos">{{data[indextr].produtos | formatProdutos}}</vs-td>
              <vs-td :data="data[indextr].id" style="min-width: 100px;">
                <router-link
                  :to="{ name: 'categorias.edit', params: {id: data[indextr].id } }"
                >
                  <vs-button 
                    color="primary" 
                    type="filled"
                    icon="edit"
                  >
                  </vs-button>
                </router-link>
                <vs-button 
                  color="warning" 
                  type="filled"
                  icon="delete"
                  @click="deleteItem(data[indextr].id, data[indextr].descricao)"
                >
                </vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>


        <vs-pagination
          prev-icon="arrow_back"
          next-icon="arrow_forward"
          :total="last_page"
          :max="total"
          :maxItems="per_page"
          v-model="currentx"
        ></vs-pagination>
      </vs-col>
      <vs-col vs-w="3" vs-xs="1"></vs-col>
    </vs-row>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: "categoria-index",
  filters: {
    formatDate: function(value) {
      return moment(value, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
    },
    formatValue: function(value) {
      return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2
      }).format(value);
    },
    formatProdutos: function(value) {
      return value.map(function(val){
        return val.descricao
      }).join(', ');
    }
  },
  data() {
    return {
      items: [],
      currentx: 1,
      last_page: 1,
      per_page: 10,
      total: 1
    };
  },
  watch: {
    currentx() {
      this.getItems()
    }
  },
  methods: {
    getItems() {
      if(isNaN(this.currentx)) {
        return;
      }
      this.$axios.get('categorias', {
        params: {
          page: this.currentx,
          perPage: this.per_page
        }
      })
      .then((response) => {
        this.last_page = response.data.data.last_page;
        this.total = response.data.data.total;
        
        let content = response.data.data

        this.items = content.data;
      })
    },
    deleteItem(id, descricao) {
      this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: `Apagar categoria`,
          text: `Você tem certeza que deseja apagar a categoria "${id} - ${descricao}"?`,
          acceptText: 'Aceitar',
          cancelText: 'Cancelar',
          accept: () => {
            this.$axios.delete(`categorias/${id}`)
              .then(() => {
                this.$vs.notify({
                  color: 'success',
                  title: 'Produto apagado',
                  text: `O produto "${id} - ${descricao}" foi apagado com sucesso!`
                })
                this.getItems()
              })
              .catch((error) => {
                  this.$vs.notify({
                      title: 'Erro',
                      text: error.message,
                      color: 'danger'
                  })
              })
          }
      })
    }
  },
  beforeMount() {
    this.getItems()
  }
};
</script>