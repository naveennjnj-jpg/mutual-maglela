// pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  FolderKanban,
  UserCheck,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CircleAlert,
  CircleCheck,
  Timer,
  Download,
  RefreshCw,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  activeProjects: number;
  activeExperts: number;
  monthlyRevenue: number;
  usersGrowth: number;
  projectsGrowth: number;
  expertsGrowth: number;
  revenueGrowth: number;
}

interface ChartData {
  month: string;
  users: number;
  revenue: number;
  projects: number;
}

interface Activity {
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

interface StatusCards {
  projectsInReview: number;
  projectsCompletedThisMonth: number;
  pendingExperts: number;
}

interface PieData {
  name: string;
  value: number;
}

// Map icon strings to components
const iconMap: Record<string, any> = {
  Users: Users,
  FolderKanban: FolderKanban,
  UserCheck: UserCheck,
  CreditCard: CreditCard,
  Activity: Activity,
  Clock: Clock,
  CircleAlert: CircleAlert,
  CircleCheck: CircleCheck,
  Timer: Timer
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartType, setChartType] = useState<'users' | 'revenue'>('users');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeProjects: 0,
    activeExperts: 0,
    monthlyRevenue: 0,
    usersGrowth: 0,
    projectsGrowth: 0,
    expertsGrowth: 0,
    revenueGrowth: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [statusCards, setStatusCards] = useState<StatusCards>({
    projectsInReview: 0,
    projectsCompletedThisMonth: 0,
    pendingExperts: 0
  });
  const [pieData, setPieData] = useState<PieData[]>([
    { name: 'Active Users', value: 0 },
    { name: 'New Users', value: 0 },
    { name: 'Inactive Users', value: 0 }
  ]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        
        // Set stats
        setStats(data.stats);
        
        // Set chart data
        if (data.chartData && data.chartData.length > 0) {
          setChartData(data.chartData);
        } else {
          // Fallback: generate mock data if none from API
          setChartData(generateMockChartData());
        }
        
        // Set recent activities
        if (data.recentActivities && data.recentActivities.length > 0) {
          setRecentActivities(data.recentActivities);
        } else {
          setRecentActivities([]);
        }
        
        // Set status cards
        setStatusCards(data.statusCards);
        
        // Set pie data
        if (data.pieData && data.pieData.length > 0) {
          setPieData(data.pieData);
        }
        
        toast.success('Dashboard data loaded successfully');
      } else {
        setError(response.data.message || "Failed to fetch dashboard data");
        toast.error(response.data.message || "Failed to fetch dashboard data");
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errorMsg = err.response?.data?.message || "Failed to fetch dashboard data";
      setError(errorMsg);
      toast.error(errorMsg);
      
      // Fallback: use mock data if API fails
      setChartData(generateMockChartData());
      setRecentActivities(getMockActivities());
    } finally {
      setLoading(false);
    }
  };

  const generateMockChartData = (): ChartData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      users: Math.floor(800 + Math.random() * 600) + (index * 30),
      revenue: Math.floor(8000 + Math.random() * 8000) + (index * 500),
      projects: Math.floor(200 + Math.random() * 200) + (index * 15)
    }));
  };

  const getMockActivities = (): Activity[] => {
    return [
      {
        icon: 'Users',
        title: "New user registered",
        description: "Amara Nwosu joined as B2C user",
        time: "2 min ago",
        color: "#4F6EF7"
      },
      {
        icon: 'FolderKanban',
        title: "Project submitted",
        description: "Journal Article by Ronald Sithole marked for review",
        time: "14 min ago",
        color: "#22C9A5"
      },
      {
        icon: 'UserCheck',
        title: "Expert onboarded",
        description: "Dr. Sipho Dlamini added as Research Expert",
        time: "1 hr ago",
        color: "#F59E0B"
      },
      {
        icon: 'CreditCard',
        title: "Subscription upgraded",
        description: "Wits University upgraded to Enterprise plan",
        time: "2 hr ago",
        color: "#E05C97"
      }
    ];
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================

  // Export as CSV
  const exportAsCSV = () => {
    try {
      // Prepare data for export
      const exportData = {
        'Dashboard Stats': {
          'Total Users': stats.totalUsers,
          'Active Projects': stats.activeProjects,
          'Active Experts': stats.activeExperts,
          'Monthly Revenue': stats.monthlyRevenue,
          'Users Growth': stats.usersGrowth + '%',
          'Projects Growth': stats.projectsGrowth + '%',
          'Experts Growth': stats.expertsGrowth + '%',
          'Revenue Growth': stats.revenueGrowth + '%'
        },
        'Status Cards': {
          'Projects In Review': statusCards.projectsInReview,
          'Projects Completed This Month': statusCards.projectsCompletedThisMonth,
          'Pending Expert Applications': statusCards.pendingExperts
        },
        'Monthly Data': chartData.reduce((acc, item) => {
          acc[item.month] = {
            'Users': item.users,
            'Revenue': item.revenue,
            'Projects': item.projects
          };
          return acc;
        }, {} as Record<string, any>),
        'User Distribution': pieData.reduce((acc, item) => {
          acc[item.name] = item.value;
          return acc;
        }, {} as Record<string, any>)
      };

      // Convert to CSV
      let csv = 'Category,Key,Value\n';
      
      Object.entries(exportData).forEach(([category, data]) => {
        if (typeof data === 'object') {
          Object.entries(data).forEach(([key, value]) => {
            csv += `"${category}","${key}","${value}"\n`;
          });
        }
      });

      // Add recent activities
      csv += '\nRecent Activities\n';
      csv += 'Title,Description,Time\n';
      recentActivities.forEach(activity => {
        csv += `"${activity.title}","${activity.description}","${activity.time}"\n`;
      });

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Dashboard data exported as CSV');
      setShowExportMenu(false);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export data');
    }
  };

  // Export as JSON
  const exportAsJSON = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        stats: stats,
        chartData: chartData,
        recentActivities: recentActivities,
        statusCards: statusCards,
        pieData: pieData
      };

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Dashboard data exported as JSON');
      setShowExportMenu(false);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export data');
    }
  };

  // Export as HTML Report
  const exportAsHTML = () => {
    try {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard Report - ${new Date().toLocaleDateString()}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #0F2D63; border-bottom: 3px solid #C85A32; padding-bottom: 10px; }
    h2 { color: #0F2D63; margin-top: 30px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .stat-card { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4F6EF7; }
    .stat-card .value { font-size: 24px; font-weight: bold; color: #0F2D63; }
    .stat-card .label { color: #6c757d; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th { background: #0F2D63; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .status-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
    .status-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
    .status-card .value { font-size: 28px; font-weight: bold; color: #C85A32; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #6c757d; font-size: 12px; text-align: center; }
    .growth-positive { color: #22c55e; }
    .growth-negative { color: #ef4444; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Dashboard Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    
    <h2>📈 Key Metrics</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="value">${stats.totalUsers.toLocaleString()}</div>
        <div class="label">Total Users <span class="${stats.usersGrowth >= 0 ? 'growth-positive' : 'growth-negative'}">${stats.usersGrowth >= 0 ? '+' : ''}${stats.usersGrowth.toFixed(1)}%</span></div>
      </div>
      <div class="stat-card" style="border-color: #22C9A5;">
        <div class="value">${stats.activeProjects.toLocaleString()}</div>
        <div class="label">Active Projects <span class="${stats.projectsGrowth >= 0 ? 'growth-positive' : 'growth-negative'}">${stats.projectsGrowth >= 0 ? '+' : ''}${stats.projectsGrowth.toFixed(1)}%</span></div>
      </div>
      <div class="stat-card" style="border-color: #F59E0B;">
        <div class="value">${stats.activeExperts.toLocaleString()}</div>
        <div class="label">Active Experts <span class="${stats.expertsGrowth >= 0 ? 'growth-positive' : 'growth-negative'}">${stats.expertsGrowth >= 0 ? '+' : ''}${stats.expertsGrowth.toFixed(1)}</span></div>
      </div>
      <div class="stat-card" style="border-color: #E05C97;">
        <div class="value">R ${stats.monthlyRevenue.toLocaleString()}</div>
        <div class="label">Monthly Revenue <span class="${stats.revenueGrowth >= 0 ? 'growth-positive' : 'growth-negative'}">${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth.toFixed(1)}%</span></div>
      </div>
    </div>

    <h2>📋 Status Overview</h2>
    <div class="status-grid">
      <div class="status-card">
        <div class="value">${statusCards.projectsInReview}</div>
        <div class="label">Projects In Review</div>
      </div>
      <div class="status-card">
        <div class="value">${statusCards.projectsCompletedThisMonth}</div>
        <div class="label">Projects Completed This Month</div>
      </div>
      <div class="status-card">
        <div class="value">${statusCards.pendingExperts}</div>
        <div class="label">Pending Expert Applications</div>
      </div>
    </div>

    <h2>📊 Monthly Performance</h2>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Users</th>
          <th>Revenue (R)</th>
          <th>Projects</th>
        </tr>
      </thead>
      <tbody>
        ${chartData.map(item => `
          <tr>
            <td><strong>${item.month}</strong></td>
            <td>${item.users.toLocaleString()}</td>
            <td>R ${item.revenue.toLocaleString()}</td>
            <td>${item.projects.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>👥 User Distribution</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        ${pieData.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.value.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>🔄 Recent Activities</h2>
    <table>
      <thead>
        <tr>
          <th>Activity</th>
          <th>Description</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${recentActivities.map(activity => `
          <tr>
            <td>${activity.title}</td>
            <td>${activity.description}</td>
            <td>${activity.time}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="footer">
      <p>Magalela Media Admin Dashboard Report</p>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
      `;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Dashboard report exported as HTML');
      setShowExportMenu(false);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export report');
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `${stats.usersGrowth >= 0 ? '+' : ''}${stats.usersGrowth.toFixed(1)}%`,
      isPositive: stats.usersGrowth >= 0,
      icon: Users,
      color: "#4F6EF7",
      bgColor: "rgba(79, 110, 247, 0.094)"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toLocaleString(),
      change: `${stats.projectsGrowth >= 0 ? '+' : ''}${stats.projectsGrowth.toFixed(1)}%`,
      isPositive: stats.projectsGrowth >= 0,
      icon: FolderKanban,
      color: "#22C9A5",
      bgColor: "rgba(34, 201, 165, 0.094)"
    },
    {
      title: "Active Experts",
      value: stats.activeExperts.toLocaleString(),
      change: `${stats.expertsGrowth >= 0 ? '+' : ''}${stats.expertsGrowth.toFixed(1)}`,
      isPositive: stats.expertsGrowth >= 0,
      icon: UserCheck,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.094)"
    },
    {
      title: "Monthly Revenue",
      value: `R ${stats.monthlyRevenue.toLocaleString()}`,
      change: `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth.toFixed(1)}%`,
      isPositive: stats.revenueGrowth >= 0,
      icon: CreditCard,
      color: "#E05C97",
      bgColor: "rgba(224, 92, 151, 0.094)"
    }
  ];

  // Render activity with dynamic icon
  const renderActivityIcon = (activity: Activity) => {
    const IconComponent = iconMap[activity.icon] || Activity;
    return <IconComponent className="w-[13px] h-[13px]" style={{ color: activity.color }} />;
  };

  const statusCardConfigs = [
    {
      title: "Projects In Review",
      value: statusCards.projectsInReview.toString(),
      icon: CircleAlert,
      bgColor: "bg-amber-50 border-amber-100",
      iconColor: "text-amber-500",
      iconBg: "bg-white"
    },
    {
      title: "Projects Completed This Month",
      value: statusCards.projectsCompletedThisMonth.toString(),
      icon: CircleCheck,
      bgColor: "bg-emerald-50 border-emerald-100",
      iconColor: "text-emerald-600",
      iconBg: "bg-white"
    },
    {
      title: "Pending Expert Applications",
      value: statusCards.pendingExperts.toString(),
      icon: Timer,
      bgColor: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-500",
      iconBg: "bg-white"
    }
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-[#0F2D63] dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-gray-600 dark:text-gray-300">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Colors for pie chart
  const COLORS = ['#4F6EF7', '#22C9A5', '#F59E0B', '#E05C97'];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !chartData.length) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 shadow-sm p-8 max-w-md text-center">
          <CircleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#0F2D63] dark:text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Overview
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63] dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Platform health and activity at a glance
          </p>
        </div>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {/* Export Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#0F2D63] text-white rounded-lg hover:bg-[#1a3a7a] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <button
                  onClick={exportAsCSV}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Export as CSV
                </button>
                <button
                  onClick={exportAsJSON}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  Export as JSON
                </button>
                <button
                  onClick={exportAsHTML}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700"
                >
                  <FileText className="w-4 h-4 text-orange-600" />
                  Export as HTML Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bgColor }}
              >
                <stat.icon className="w-[18px] h-[18px]" style={{ color: stat.color }} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-semibold ${
                  stat.isPositive ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {stat.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F2D63] dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-semibold text-[#0F2D63] dark:text-white text-sm">Platform Growth</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setChartType('users')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  chartType === 'users'
                    ? 'bg-[#0F2D63] text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}
              >
                User Signups
              </button>
              <button
                onClick={() => setChartType('revenue')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  chartType === 'revenue'
                    ? 'bg-[#0F2D63] text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}
              >
                Revenue
              </button>
            </div>
          </div>
          <div className="h-[220px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'users' ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F6EF7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4F6EF7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#4F6EF7" 
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                      name="Total Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#4F6EF7" 
                      strokeWidth={2}
                      dot={{ fill: '#4F6EF7', r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Users Trend"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(value) => `R${value/1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      fill="#E05C97" 
                      name="Revenue (R)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No chart data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-[15px] h-[15px] text-[#C85A32]" />
            <h2 className="font-semibold text-[#0F2D63] dark:text-white text-sm">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${activity.color}20` }}
                  >
                    {renderActivityIcon(activity)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0F2D63] dark:text-white leading-tight">
                      {activity.title}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight truncate">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-[9px] h-[9px]" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statusCardConfigs.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} border rounded-2xl p-4 flex items-center gap-4 dark:bg-gray-800 dark:border-gray-700`}
          >
            <div className={`w-9 h-9 ${card.iconBg} rounded-xl flex items-center justify-center shadow-sm dark:bg-gray-700`}>
              <card.icon className={`w-[15px] h-[15px] ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F2D63] dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;