import PathTracker from "@/Shared/PathTracker";
import ProfileHeader from "./_components/ProfileHeader";

const page = () => {
  return (
    <div className="mt-28 container">
      <div className="border-b border-black pb-8">
        <PathTracker />
      </div>

      <ProfileHeader />
    </div>
  );
};

export default page;
