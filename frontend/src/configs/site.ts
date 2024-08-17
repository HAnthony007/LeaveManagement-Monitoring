import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
    {
        value: "bug",
        label: "Bug",
    },
    {
        value: "feature",
        label: "Feature",
    },
    {
        value: "documentation",
        label: "Documentation",
    },
];

export const statuses = [
    {
        value: "backlog",
        label: "Backlog",
        icon: QuestionMarkCircledIcon,
    },
    {
        value: "todo",
        label: "Todo",
        icon: CircleIcon,
    },
    {
        value: "in progress",
        label: "In Progress",
        icon: StopwatchIcon,
    },
    {
        value: "done",
        label: "Done",
        icon: CheckCircledIcon,
    },
    {
        value: "canceled",
        label: "Canceled",
        icon: CrossCircledIcon,
    },
];

export const statusCong = [
    {
        value: "En attente",
        label: "En attente RH",
    },
    {
        value: "En attente superieur",
        label: "En attente superieur",
    },
    {
        value: "Aprouver",
        label: "Aprouver",
    },
    {
        value: "Refuser",
        label: "Refuser",
    },
];

export const priorities = [
    {
        label: "Low",
        value: "low",
        icon: ArrowDownIcon,
    },
    {
        label: "Medium",
        value: "medium",
        icon: ArrowRightIcon,
    },
    {
        label: "High",
        value: "high",
        icon: ArrowUpIcon,
    },
];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Gestion et suivi de conge",
    description:
        "Faire une application de gestion et suivi de conge des employes au seins de spat",

    navRH: [
        {
            label: "Dashboard",
            href: "/rh/dashboard",
        },
        {
            label: "Users",
            href: "/rh/users",
        },
        {
            label: "ListeConge",
            href: "/rh/listeConge",
        },
        {
            label: "Planing",
            href: "/rh/planing",
        },
    ],

    navEmploye: [
        {
            label: "Dashboard",
            href: "/employe/dashboard",
        },
        {
            label: "MonConge",
            href: "/employe/monConge",
        },
        {
            label: "Calendrier",
            href: "/employe/calendrier",
        },
    ],

    navAdmin: [
        {
            label: "Dashboard",
            href: "/admin/dashboard",
        },
        {
            label: "Users",
            href: "/admin/users",
        },
        {
            label: "Departement",
            href: "/admin/departement",
        },
    ],

    navChefDTP: [
        {
            label: "Dashboard",
            href: "/chefdtp/dashboard",
        },
        {
            label: "MonConge",
            href: "/chefdtp/monConge",
        },

        {
            label: "MyEmployes",
            href: "/chefdtp/myEmploye",
        },
        {
            label: "DemandeConge",
            href: "/chefdtp/listeConge",
        },
        {
            label: "MonCalendrier",
            href: "/chefdtp/monCalendrier",
        },
        {
            label: "Planing",
            href: "/chefdtp/planing",
        },
    ],
};
