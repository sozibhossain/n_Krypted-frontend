export default function NotifyMeList() {
    // Sample notification data
    const notifications = [
        { id: 1, title: "New deals available", description: "Get notified when new deals are available" },
        { id: 2, title: "Price drops", description: "Get notified when prices drop on your saved items" },
        { id: 3, title: "Booking confirmations", description: "Get notified when your booking is confirmed" },
        { id: 4, title: "Booking reminders", description: "Get reminded about your upcoming bookings" },
        { id: 5, title: "Special offers", description: "Get notified about special offers and promotions" },
    ]

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Notify Me List</h1>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 bg-zinc-900 rounded-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{notification.title}</h3>
                                <p className="text-sm text-gray-400">{notification.description}</p>
                            </div>
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={notification.id % 2 === 0} />
                                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
  