"use client"
import { ClipboardPaste } from "lucide-react";
import { useState } from "react";
import MyProfile from "./MyProfile";
import Settings from "./Settings";
import BidHistory from "./BidHistory";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsCondition from "./TermsCondition";

const ProfileHeader = () => {

    const [active, setActive] = useState('profile');

  return (
    <div>
      <h1 className="text-center text-[40px] font-bold my-8">Accounts</h1>

      <div className="flex justify-between items-center font-medium text-[#645949] border-b-2 h-[40px]">
        <button 
        className={`${active === "profile" && "border-b-2 border-black font-bold"} h-[39px]`}
        onClick={() => setActive('profile')}
        >
          My Profile
        </button>

        <button
        className={`${active === "settings" && "border-b-2 border-black font-bold"} h-[39px]`}
        onClick={() => setActive('settings')}
        >
            Settings
        </button>

        <button
        className={`${active === "bidHistory" && "border-b-2 border-black font-bold"} h-[39px]`}
        onClick={() => setActive('bidHistory')}
        >
            Bid History
        </button>

        <button
        className={`${active === "privacyPolicy" && "border-b-2 border-black font-bold"} h-[39px]`}
        onClick={() => setActive('privacyPolicy')}
        >
            Privacy Policy
        </button>

        <button
        className={`${active === "termsCondition" && "border-b-2 border-black font-bold"} h-[39px]`}
        onClick={() => setActive('termsCondition')}
        >
            Terms & Conditions
        </button>

        <button className="flex text-red-500 font-bold">
          {" "}
          <ClipboardPaste className="text-[14px]" /> Log out
        </button>
      </div>

      <div className="mt-5 mb-28">
        {active === "profile" && <MyProfile />}
        {active === "settings" && <Settings />}
        {active === "bidHistory" && <BidHistory />}
        {active === "privacyPolicy" && <PrivacyPolicy />}
        {active === "termsCondition" && <TermsCondition />}
      </div>
    </div>
  );
};

export default ProfileHeader;
