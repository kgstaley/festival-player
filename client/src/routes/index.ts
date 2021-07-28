import { lazy } from "react";

export const routes = [
  {
    id: "home",
    paths: ["/home"],
    exact: true,
    component: lazy(() => import("../components/Home")),
    requiresAuth: true,
  },
  {
    id: "dashboard",
    paths: ["/dashboard"],
    exact: true,
    component: lazy(() => import("../components/Dashboard")),
    requiresAuth: true,
  },
  {
    id: "landing",
    paths: ["/"],
    exact: true,
    component: lazy(() => import("../components/Landing")),
    requiresAuth: false,
  },
];
