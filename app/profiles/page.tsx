"use client"

import { useState } from "react"
import Image from "next/image"
import { User, Lock, Calendar, Bell, LogOut } from "lucide-react"
import PersonalInfoForm from "@/components/personal-info-form"
import { ChangePasswordForm } from "@/components/ChangePasswordForm"
import BookingHistoryTable from "@/components/booking-history-table"
import NotifyMeList from "@/components/notify-me-list"
import { PageHeader } from "@/Shared/PageHeader"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("personal-info")
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    const session = useSession();
    const user = session.data?.user
    console.log(user)

    const userData = {
        name: "Bessie Edwards",
        email: "darrelsteward@gmail.com",
        profileImage: "/profile-image.jpg",
        personalInfo: {
            firstName: "Bessie",
            lastName: "Edwards",
            email: "darrelsteward@gmail.com",
            phone: "(307) 555-0133",
            country: "USA",
            cityState: "Alabama",
            roadArea: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        },
    }

    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: '/' }); // Redirect to home page after logout
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setShowLogoutDialog(false);
        }
    }

    return (
        <div>
            <PageHeader
                title="My Profile"
                imge="/assets/herobg.png"
                items={[
                    {
                        label: "Home",
                        href: "/",
                    },
                    {
                        label: "My Profile",
                        href: "/profiles",
                    },
                ]}
            />
            <div className="flex flex-col md:flex-row min-h-screen text-white container pt-[80px]">
                {/* Static Left Sidebar */}
                <div className="w-full md:w-80 p-6 flex flex-col items-center md:sticky md:top-0 md:h-screen">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-32 h-32 mb-2">
                            <Image src="/assets/profile_image.png" alt="Profile" fill className="rounded-full object-cover" />
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H15C16.1046 20 17 19.1046 17 18V15"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9 15H12L20.5 6.5C21.3284 5.67157 21.3284 4.32843 20.5 3.5C19.6716 2.67157 18.3284 2.67157 17.5 3.5L9 12V15Z"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M16 5L19 8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>

                    <nav className="w-full space-y-2">
                        <button
                            onClick={() => setActiveTab("personal-info")}
                            className={`flex items-center w-full p-3 rounded-md ${activeTab === "personal-info" ? "bg-zinc-800" : "hover:bg-zinc-800"}`}
                        >
                            <User className="mr-3 h-5 w-5" />
                            <span>Personal Information</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("change-password")}
                            className={`flex items-center w-full p-3 rounded-md ${activeTab === "change-password" ? "bg-zinc-800" : "hover:bg-zinc-800"}`}
                        >
                            <Lock className="mr-3 h-5 w-5" />
                            <span>Change Password</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("booking-history")}
                            className={`flex items-center w-full p-3 rounded-md ${activeTab === "booking-history" ? "bg-zinc-800" : "hover:bg-zinc-800"}`}
                        >
                            <Calendar className="mr-3 h-5 w-5" />
                            <span>Booking History</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("notify-me")}
                            className={`flex items-center w-full p-3 rounded-md ${activeTab === "notify-me" ? "bg-zinc-800" : "hover:bg-zinc-800"}`}
                        >
                            <Bell className="mr-3 h-5 w-5" />
                            <span>Notify Me List</span>
                        </button>

                        <button
                            onClick={() => setShowLogoutDialog(true)}
                            className="flex items-center w-full p-3 text-red-500 hover:bg-zinc-800 rounded-md mt-auto"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            <span>Log out</span>
                        </button>
                    </nav>
                </div>

                {/* Dynamic Right Content */}
                <div className="flex-1 p-6 md:p-10 container">
                    {activeTab === "personal-info" && <PersonalInfoForm initialData={userData.personalInfo} />}

                    {activeTab === "change-password" && <ChangePasswordForm />}

                    {activeTab === "booking-history" && <BookingHistoryTable />}

                    {activeTab === "notify-me" && <NotifyMeList />}
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <div className="flex justify-center mb-2">
                            <div className="text-center text-xl font-semibold">Walk Through</div>
                        </div>
                        <DialogTitle className="text-center">Are You Sure To Log Out?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row justify-center gap-4 sm:justify-center mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowLogoutDialog(false)}
                            className="w-full sm:w-24 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
                        >
                            No
                        </Button>
                        <Button onClick={handleLogout} className="w-full sm:w-24 bg-zinc-800 hover:bg-zinc-700 text-white">
                            Yes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
