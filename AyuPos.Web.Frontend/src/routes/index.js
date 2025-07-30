import DashboardPage from '../pages/DashboardPage';
import InventoryPage from '../pages/InventoryPage';
import ProductPage from '../pages/ProductPage';
import SalesPage from '../pages/SalesPage';
import ReportPage from '../pages/ReportPage';
import UserManagementPage from '../pages/UserManagementPage';
import StoreInformationPage from '../pages/StoreInformationPage';

export const protectedRoutes = [
  { path: '/dashboard', component: DashboardPage },
  { path: '/inventory', component: InventoryPage },
  { path: '/products', component: ProductPage },
  { path: '/sales', component: SalesPage },
  { path: '/reports', component: ReportPage },
  { path: '/settings/users', component: UserManagementPage },
  { path: '/settings/store', component: StoreInformationPage },
];
