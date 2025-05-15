import RegisterPage from '../Pages/Auth/Register/register-Pg';
import LoginPage from '../Pages/Auth/Login/login-Pg';
import HomePage from '../Pages/Home/home-Pg';
import BookmarkPage from '../Pages/Marked Book/bookmark-Pg';
import NewReportPage from '../Pages/Add New/add-New-Pg';
import { enforceLoginForProtectedRoute, restrictAccessIfAuthenticated } from '../Utils/auth';
import ReportDetailPage from '../Pages/report-Detail/report-detail-Pg'; 

export const routes = {
  '/login': () => restrictAccessIfAuthenticated(new LoginPage()),
  '/register': () => restrictAccessIfAuthenticated(new RegisterPage()),

  '/': () => enforceLoginForProtectedRoute(new HomePage()),
  '/new': () => enforceLoginForProtectedRoute(new NewReportPage()),
  '/bookmark': () => enforceLoginForProtectedRoute(new BookmarkPage()),
  '/listStory/:id': () => enforceLoginForProtectedRoute(new ReportDetailPage()),
};


