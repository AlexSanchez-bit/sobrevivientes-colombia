export const promotionsRoutes = [
  {
    path: "promotions",
    name: "promotions",
    component: () => import("@/pages/promotions/index.vue"),
  },
  {
    path: "promotions/create",
    name: "promotions.create",
    component: () => import("@/components/promotions/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "promotions/:id/edit",
    name: "promotions.edit",
    component: () => import("@/components/promotions/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      promotion_id: route.params.id,
    }),
  },
];
