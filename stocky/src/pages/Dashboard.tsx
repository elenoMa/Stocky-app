import DashboardLayout from "../components/DashboardLayout ";
import SummaryCards from "../components/SummaryCards";
import StockAlertsPanel from "../components/StockAlertsPanel";
import QuickStockOutForm from "../components/QuickStockOutForm";


const Dashboard = () => {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            <SummaryCards />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StockAlertsPanel />
                <QuickStockOutForm />
                {/* Aquí pondremos QuickStockOutForm y StockCharts */}
            </div>
        </DashboardLayout>

    );
}

export default Dashboard;