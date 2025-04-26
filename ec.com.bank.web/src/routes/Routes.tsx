import { lazy, LazyExoticComponent, ComponentType } from 'react';
const Dashboard = lazy(() => import('pages/dashboard/DashboardContainer'));
const MyProfile = lazy(() => import('pages/profile/MyProfileContainer'));
const VirtualAssistant = lazy(() => import('pages/assistant/VirtualAssistant'));

export interface IRoute {
    path: string;
    pathLabel: string | ((state?: unknown) => string);
    key?: string;
    component: LazyExoticComponent<ComponentType<unknown>>;
}

export const routes: IRoute[] = [
    {
        path: '/home',
        key: 'home',
        pathLabel: 'Inicio',
        component: Dashboard,
    },
    {
        path: 'profile',
        key: 'profile',
        pathLabel: 'Mi Perfil',
        component: MyProfile,
    },
    {
        path: '/virtual-assistant',
        key: 'virtual-assistant',
        pathLabel: 'Asistente Virtual',
        component: VirtualAssistant,
    },
];