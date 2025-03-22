export const laicsRoutes = [
  {
    path: "laics",
    name: "laics",
    component: () => import("@/pages/laics/index.vue"),
  },
  {
    path: "laics/create",
    name: "laics.create",
    component: () => import("@/components/Laics/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "laics/:id/edit",
    name: "laics.edit",
    component: () => import("@/components/Laics/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      laic_id: route.params.id,
    }),
  },
];
