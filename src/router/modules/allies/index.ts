
export const allieRoutes = [
  {
    path: "allies",
    name: "allies",
    component: () => import("@/pages/allies/index.vue"),
  },
  {
    path: "allies/create",
    name: "allies.create",
    component: () => import("@/components/Allies/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "allies/:id/edit",
    name: "allies.edit",
    component: () => import("@/components/Allies/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      allie_id: route.params.id,
    }),
  },
];
