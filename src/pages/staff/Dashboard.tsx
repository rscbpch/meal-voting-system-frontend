import Sidebar from "../../components/SideBar";
import PageTransition from "../../components/PageTransition";

const Dashboard = () => {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <PageTransition>
                <main className="ml-64 flex-1 overflow-y-auto">
                    <h1>hello</h1>
                </main>
            </PageTransition>
        </div>
    );
};

export default Dashboard;
