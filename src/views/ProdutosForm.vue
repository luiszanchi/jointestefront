<template>
  <div ref="template">
    <h1 v-if="isNew">Novo produto</h1>
    <h1 v-if="!isNew">Editar produto - {{ descricao }}</h1>

    <vs-row>
      <vs-col vs-w="3" vs-xs="1"></vs-col>
      <vs-col vs-w="6" vs-xs="10">
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
          <vs-col vs-w="6" vs-xs="12"  class="form-padding">
            <vs-input
              label-placeholder="Valor"
              class="full-width"
              v-model="valor"
              v-money
              :danger="$v.valor.$error"
              @input="$v.valor.$touch"
            />

            <div v-if="$v.valor.$dirty" style="margin-top: 10px;">
              <vs-alert
                v-if="!$v.valor.required"
                title="Obrigatório"
                active="true"
                color="danger"
                class="alert-margin-top"
              >O campo Valor é Obrigatório!</vs-alert>
              <vs-alert
                v-if="!$v.valor.checkIfPositive"
                title="Não negativo"
                active="true"
                color="danger"
                class="alert-margin-top"
              >O campo Valor não pode ser negativo!</vs-alert>
            </div>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col vs-w="6" vs-xs="12"  class="form-padding">
            <vs-input
              label-placeholder="Código"
              class="full-width"
              v-model="codigo"
              :danger="$v.codigo.$error"
              @input="$v.codigo.$touch"
            />

            <div v-if="$v.codigo.$dirty" style="margin-top: 10px;">
              <vs-alert
                v-if="!$v.codigo.required"
                title="Obrigatório"
                active="true"
                color="danger"
                class="alert-margin-top"
              >O campo Código é Obrigatório!</vs-alert>
              <vs-alert
                v-if="!$v.codigo.checkIfCodeExists"
                title="Código já existente"
                active="true"
                color="danger"
                class="alert-margin-top"
              >Já existe outro produto com o mesmo código!</vs-alert>
            </div>
          </vs-col>
          <vs-col vs-w="6" vs-xs="12"  class="form-padding vs-select-padding">
            <vs-select
              placeholder="Categorias"
              multiple
              autocomplete
              class="selectExample full-width"
              v-model="categorias_selecionadas"
              label="Categorias"
            >
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in categorias"
              />
            </vs-select>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col vs-w="6" vs-xs="12"  class="form-padding">
            <vs-input
              v-if="!isNew"
              label-placeholder="Código"
              class="full-width"
              v-model="created_at"
              disabled="true"
            />
          </vs-col>
          <vs-col vs-w="6" vs-xs="12"  class="form-padding">
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
      <vs-col vs-w="3" vs-xs="1"></vs-col>
    </vs-row>
  </div>
</template>

<script>
import moment from "moment";
import { required } from "vuelidate/lib/validators";

const isInt = function (n){
    return Number(n) === n && n % 1 === 0;
}

const isFloat = function (n){
    return Number(n) === n && n % 1 !== 0;
}

const checkIfCodeExists = async function(value, component) {
  let id = component.$props.id;

  let response = await component.$axios.get("produtos/check-codigo", {
    params: {
      id: id,
      codigo: value
    }
  });

  return !response.data.data;
};

const checkIfPositive = function(value) {
    if (isInt(value) || isFloat(value)) {
        return true;
    }
    let stringFloat = value
        .split('R$ ').join('')
        .split('.').join('')
        .split(',').join('.');

    let val = parseFloat(stringFloat);
    
    return val >= 0;
}

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
    formatCategorias: function(value) {
      return value
        .map(function(val) {
          return val.descricao;
        })
        .join(", ");
    }
  },
  data() {
    return {
      descricao: "",
      valor: 0.0,
      codigo: "",
      created_at: "",
      updated_at: "",
      categorias: [],
      categorias_selecionadas: [],
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
    },
    valor: {
      required,
      checkIfPositive
    },
    codigo: {
      required,
      checkIfCodeExists
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
        .get("categorias", {
          params: {
            perPage: "0"
          }
        })
        .then(response => {
          this.categorias = response.data.data.map(function(item) {
            return {
              value: item.id,
              text: item.descricao
            };
          });
        });
    },
    cancel() {
        this.$router.push({
            name: "products.index"
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
            this.$axios.post('produtos', {
                descricao: this.descricao,
                valor: parseFloat(this.valor.split('R$ ').join('').split('.').join('').split(',').join('.')),
                codigo: this.codigo,
                categorias: this.categorias_selecionadas
            })
            .then(() => {
                this.$vs.notify({
                    title: 'Sucesso',
                    text: 'O produto foi salvo com sucesso!',
                    color: 'success'
                });

                this.$router.push({
                    name: "products.index"
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

        this.$axios.put(`produtos/${this.id}`, {
            descricao: this.descricao,
            valor: parseFloat(this.valor.split('R$ ').join('').split('.').join('').split(',').join('.')),
            codigo: this.codigo,
            categorias: this.categorias_selecionadas
        })
        .then(() => {
            this.$vs.notify({
                title: 'Sucesso',
                text: 'O produto foi salvo com sucesso!',
                color: 'success'
            });

            this.$router.push({
                name: "products.index"
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
        
        this.$axios.get(`produtos/${this.id}`)
            .then((response) => {
                let data = response.data.data;
                this.descricao = data.descricao;
                
                this.valor = data.valor * 100
                
                this.codigo = data.codigo;
                this.categorias_selecionadas = data.categorias.map((item) => item.id)
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