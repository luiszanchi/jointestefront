<template>
  <div ref="template">
    <h1 v-if="isNew">Nova Categoria</h1>
    <h1 v-if="!isNew">Editar categoria - {{ descricao }}</h1>

    <vs-row>
      <vs-col vs-w="3" vs-xs="1" ></vs-col>
      <vs-col vs-w="6" vs-xs="10" >
        <vs-row>
          <vs-col vs-w="6" vs-xs="12" class="form-padding">
            <vs-input
              label-placeholder="Descrição"
              class="full-width"
              v-model="descricao"
              :danger="$v.descricao.$error"
              @input="$v.descricao.$touch"
            />

            <div v-if="$v.descricao.$dirty" style="margin-top: 10px;">
              <vs-alert
                v-if="!$v.descricao.required"
                title="Obrigatório"
                active="true"
                color="danger"
                class="alert-margin-top"
              >O campo Descrição é Obrigatório!</vs-alert>
            </div>
          </vs-col>
          <vs-col vs-w="6" vs-xs="12" class="form-padding vs-select-padding">
            <vs-select
              placeholder="Produtos"
              multiple
              autocomplete
              class="selectExample full-width"
              v-model="produtos_selecionados"
              label="produtos"
            >
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in produtos"
              />
            </vs-select>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col vs-w="6" vs-xs="12" class="form-padding">
            <vs-input
              v-if="!isNew"
              label-placeholder="Código"
              class="full-width"
              v-model="created_at"
              disabled="true"
            />
          </vs-col>
          <vs-col vs-w="6" vs-xs="12" class="form-padding">
            <vs-input
              v-if="!isNew"
              label-placeholder="Código"
              class="full-width"
              v-model="updated_at"
              disabled="true"
            />
          </vs-col>
        </vs-row>

        <vs-row vs-type="flex">
          <vs-col vs-w="12" class="form-padding" vs-justify="flex-end" vs-align="flex-end">
            <vs-button 
                color="primary" 
                type="filled" 
                class="float-right"
                @click="save()"
            >
                Salvar
            </vs-button>
            <vs-button @click="cancel()" color="warning" type="filled" class="float-right">Cancelar</vs-button>
          </vs-col>
        </vs-row>
      </vs-col>
      <vs-col vs-w="3" vs-xs="1" ></vs-col>
    </vs-row>
  </div>
</template>

<script>
import moment from "moment";
import { required } from "vuelidate/lib/validators";

export default {
  name: "produtos-form",
  props: {
    id: {
      default: null
    }
  },
  computed: {
    isNew: function() {
      return !this.id;
    }
  },
  filters: {
    formatValue: function(value) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
      }).format(value);
    },
  },
  data() {
    return {
      descricao: "",
      created_at: "",
      updated_at: "",
      produtos: [],
      produtos_selecionados: [],
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  validations: {
    descricao: {
      required
    }
  },
  methods: {
    axios_get: function (response) {
        return new Promise (function (resolve) {
            setTimeout(function () {
                resolve(response)
            }, 1000)
        })
    },
    formatDate: function(value) {
      return moment(value, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY");
    },
    getCategorias() {
      this.$axios
        .get("produtos", {
          params: {
            perPage: "0"
          }
        })
        .then(response => {
          this.produtos = response.data.data.map(function(item) {
            return {
              value: item.id,
              text: item.descricao
            };
          });
        });
    },
    cancel() {
        this.$router.push({
            name: "categorias.index"
        });
    },
    save() {
        this.$v.$touch()

        if(this.$v.$invalid) {
            this.$vs.notify({
                title: 'Aviso',
                text: 'Você precisa preencher os campos',
                color: 'danger'
            })
            return;
        }
        this.$vs.loading()

        if(this.isNew) {
            this.$axios.post('categorias', {
                descricao: this.descricao,
                produtos: this.produtos_selecionados
            })
            .then(() => {
                this.$vs.notify({
                    title: 'Sucesso',
                    text: 'A categoria foi salva com sucesso!',
                    color: 'success'
                });

                this.$router.push({
                    name: "categorias.index"
                });
            })
            .catch((error) => {
                this.$vs.notify({
                    title: 'Erro',
                    text: error.message,
                    color: 'danger'
                })
            })
            .finally(() => {
                this.$vs.loading.close()
            })

            return;
        }

        this.$axios.put(`categorias/${this.id}`, {
            descricao: this.descricao,
            produtos: this.produtos_selecionados
        })
        .then(() => {
            this.$vs.notify({
                title: 'Sucesso',
                text: 'A categoria foi salva com sucesso!',
                color: 'success'
            });

            this.$router.push({
                name: "categorias.index"
            });
        })
        .catch((error) => {
            this.$vs.notify({
                title: 'Erro',
                text: error.message,
                color: 'danger'
            })
        })
        .finally(() => {
            this.$vs.loading.close()
        })
    }
  },
  beforeMount() {
    this.getCategorias();
    if (! this.isNew) {
        this.$vs.loading()
        
        this.$axios.get(`categorias/${this.id}`)
            .then((response) => {
                let data = response.data.data;
                this.descricao = data.descricao;
                
                this.produtos_selecionados = data.produtos.map((item) => item.id)
                this.created_at = this.formatDate(data.created_at);
                this.updated_at = this.formatDate(data.updated_at);

                this.$v.$touch()
            })
            .catch((error) => {
                this.$vs.notify({
                    title: 'Erro',
                    text: error.message,
                    color: 'danger'
                })
            })
            .finally(() => {
                this.$vs.loading.close()
            })
    }
  }
};
</script>

<style scoped>
.form-padding {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
}
.vs-select-padding {
  padding-top: 8px;
}
.float-right {
  float: inline-end;
}
</style>