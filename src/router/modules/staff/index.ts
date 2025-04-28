export const staffRoutes = [
  {
    path: "staff-members",
    name: "staff-members",
    component: () => import("@/pages/staff-members/index.vue"),
  },
  {
    path: "staff-members/create",
    name: "staff-members.create",
    component: () => import("@/components/StaffMember/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "staff-members/:id/edit",
    name: "staff-members.edit",
    component: () => import("@/components/StaffMember/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      staff_id: route.params.id,
    }),
  },
];
