import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: () => import('@/components/Template.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/produtos',
        name: 'products.index',
        component: () => import('@/views/ProdutosIndex.vue')
      },
      {
        path: '/produtos/create',
        name: 'products.create',
        component: () => import('@/views/ProdutosForm.vue')
      },
      {
        path: '/produtos/:id/edit',
        name: 'products.edit',
        props: true,
        component: () => import('@/views/ProdutosForm.vue')
      },
      {
        path: '/categorias',
        name: 'categorias.index',
        component: () => import('@/views/CategoriasIndex.vue')
      },
      {
        path: '/categorias/create',
        name: 'categorias.create',
        component: () => import('@/views/CategoriasForm.vue')
      },
      {
        path: '/categorias/:id/edit',
        name: 'categorias.edit',
        props: true,
        component: () => import('@/views/CategoriasForm.vue')
      },
      {
          path: '*',
          redirect: '/home'
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
