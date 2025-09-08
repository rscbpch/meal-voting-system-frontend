import Sidebar from "../../components/SideBar";
import PageTransition from "../../components/PageTransition";
import TopFoods from "../../components/TopFoods";
import AllFoodsRank from "../../components/AllFoodsRank";
import VotingChart from "../../components/VotingChart";

const Dashboard = () => {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <main className="flex-1 ml-64 bg-[#F6FFE8]">
                <PageTransition>
                    <div className="sticky top-0 z-50 bg-white shadow-sm p-6 mb-6">
                        <h1 className="text-2xl font-semibold text-[#3A4038]">
                            Dashboard
                        </h1>
                    </div>

                    <div className="p-6 grid grid-cols-2 gap-6">
                        <VotingChart />
                        <div>
                            <TopFoods items={[
                                { name: 'Food 1', votes: 600 },
                                { name: 'Food 2', votes: 400 },
                                { name: 'Food 3', votes: 80 },
                                { name: 'Food 4', votes: 30 },
                            ]} />
                        </div>
                        <div>
                            <AllFoodsRank items={[
                                { name: 'Food 1', votes: 600 },
                                { name: 'Food 2', votes: 400 },
                                { name: 'Food 3', votes: 80 },
                                { name: 'Food 4', votes: 30 },
                                { name: 'Food 5', votes: 20 },
                            ]} />
                        </div>
                    </div>
                </PageTransition>
            </main>
        </div>
    );
};

export default Dashboard;
