export const userRoutes = [
  {
    path: "users",
    name: "users",
    component: () => import("@/pages/users/index.vue"),
  },
  {
    path: "users/:id/edit",
    name: "users.edit",
    component: () => import("@/components/Users/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      user_id: route.params.id,
    }),
  },
  {
    path: "users/create",
    name: "users.create",
    component: () => import("@/components/Users/CreateOrModify.vue"),
    props: () => ({
      mode: "create",
    }),
  },
];
