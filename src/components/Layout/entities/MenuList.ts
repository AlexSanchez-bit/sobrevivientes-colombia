import { Permission } from "@/utils/Permissions";
import { GroupMenuType } from "./GroupMenu";
import { type MenuListItem } from "./MenuListItem";
export const MenuList: MenuListItem[] = [
  {
    name: "Administrative",
    icon: "",
    router_direction: "",
    type: GroupMenuType.Static,
    childrenMenu: [
      {
        name: "users",
        icon: "pi pi-user",
        router_direction: "/users",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_USER],
      },
      {
        name: "Miembros del Staff",
        icon: "pi pi-users",
        router_direction: "/staff-members",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_STAFF_MEMBERS],
      },

      {
        name: "Aliados",
        icon: "pi pi-link",
        router_direction: "/allies",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_ALLIES],
      },


    ],
  },
  {
    name: "Actividades de la red",
    icon: "pi pi-envelope",
    router_direction: "",
    type: GroupMenuType.Static,
    childrenMenu: [

      {
        name: "Testimonios",
        icon: "pi pi-clipboard",
        router_direction: "/testimonies",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_TESTIMONIES],
      },
      {
        name: "Tipos Laicos",
        icon: "pi pi-crown",
        router_direction: "/laics",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_LAIC_TYPES],
      },
      {
        name: "Promociones",
        icon: "pi pi-clock",
        router_direction: "/promotions",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_PROMOTION],
      },
      {
        name: "Blog",
        icon: "pi pi-book",
        router_direction: "/blog-entries",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_BLOG_ENTRIES],
      },



    ]


  },
  {
    name: "Atención a usuarios",
    icon: "pi pi-envelope",
    router_direction: "",
    type: GroupMenuType.Static,
    childrenMenu: [
      {
        name: "Chat",
        icon: "pi pi-comments",
        router_direction: "/chat",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_CHAT],
      },
      {
        name: "Datos del bot",
        icon: "pi pi-file-pdf",
        router_direction: "/bot",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_BOT_TRAIN],
      },
    ],
  },
];
