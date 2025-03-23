export const blogRoutes = [
  {
    path: "blog-entries",
    name: "blog_entries",
    component: () => import("@/pages/blog-entries/index.vue"),
  },
  {
    path: "blog-entries/create",
    name: "blog-entries.create",
    component: () => import("@/components/Blog/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "blog-entries/:id/edit",
    name: "blog-entries.edit",
    component: () => import("@/components/Blog/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      blog_id: route.params.id,
    }),
  },
];
