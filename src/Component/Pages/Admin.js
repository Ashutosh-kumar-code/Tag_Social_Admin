import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Dashboard from "./dashboard/Dashboard";
import { useEffect } from "react";
import "../../assets/js/custom";
import UserPage from "./UserPage/User";
import VideoPage from "./VideoPage/VideoPage";
import PaymentSetting2 from "./PaymentSetting";
import ChannelPage from "./Channel/ChannelPage";
import ContactUsPage from "./ContactUs";
import ShortsPage from "./Shorts/ShortsPage";
import SoundPage from "./Sound/SoundPage";
import FAQ from "./FAQ";
import Profile from "./Profile";
import PremiumPlan from "./PremiumPlan/PremiumPlan";
import UserSetting from "./UserPage/UserSetting";
import Currency from "./Currency";
import ManageSetting from "./Setting/ManageSetting";
import ManageWithDraw from "./WithDrawRequest/ManageWithDraw";
import ManageMonetization from "./MonetizationRequest/ManageMonetization";
import ManageReport from "./Report/ManageReport";
import MainEarnings from "./Earnings/MainEarnings";
import ManageReward from "./RewardSetting/ManageReward";
import CoinPlan from "./Coin/CoinPlan";
import CoinPlanHistory from "./Earnings/CoinPlanHistory";


const Admin = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname == "/" ||
      location.pathname == "/admin" ||
      location.pathname == ""
    ) {
      navigate("/admin/mainDashboard");
    }
  }, []);

  return (
    <>
      <div className="mainContainer d-flex w-100">
        <div className="containerLeft">
          <Sidebar />
        </div>
        <div className="containerRight w-100 ">
          <Navbar />
          <div className="mainAdmin ml-4">
            <div className="mobSidebar-bg  d-none"></div>
            <Routes>
              <Route path="/mainDashboard" element={<Dashboard />} />
              <Route path="/userTable" element={<UserPage />} />
              <Route path="/videos" element={<VideoPage />} />
              <Route path="/shorts" element={<ShortsPage />} />
              <Route path="/channel" element={<ChannelPage />} />
              <Route path="/sound" element={<SoundPage />} />
              <Route path="/paymentSetting2" element={<PaymentSetting2 />} />
              <Route path="/settingPage" element={<ManageSetting />} />
              <Route path="/allfaq" element={<FAQ />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/userProfile" element={<UserSetting />} />
              <Route path="/allreport" element={<ManageReport />} />
              <Route path="/premiumPlanTable" element={<PremiumPlan />} />
              <Route path="/coinPlanTable" element={<CoinPlan />} />
              <Route path="/coinplanhistory" element={<CoinPlanHistory />} />
              <Route path="/contactUs" element={<ContactUsPage />} />
              <Route path="/allCurrency" element={<Currency />} />
              <Route path="/withrawRequest" element={<ManageWithDraw />} />
              <Route path="/reward" element={<ManageReward />} />
              <Route
                path="/allmonetizationRequest"
                element={<ManageMonetization />}
              />
              <Route path="/adminEarnings" element={<MainEarnings />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
