// import { useMutation, useQuery } from "@tanstack/react-query";

// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
// const USER_ID = "67fe1177d638e66cd751a11d";

// // Profile API
// export const useGetProfile = () => {
//   return useQuery({
//     queryKey: ["profile"],
//     queryFn: async () => {
//       const response = await fetch(`${BASE_URL}/profile/get/${USER_ID}`);
//       const data = await response.json();

//       if (!data.status) {
//         throw new Error(data.message || "Failed to fetch profile");
//       }

//       return data.data;
//     },
//   });
// };

// export const useUpdateProfile = () => {
//   return useMutation({
//     mutationFn: async (formData: FormData) => {
//       const response = await fetch(`${BASE_URL}/profile/update/${USER_ID}`, {
//         method: "PUT",
//         body: formData,
//       });

//       const data = await response.json();

//       if (!data.status) {
//         throw new Error(data.message || "Failed to update profile");
//       }

//       return data.data;
//     },
//   });
// };

// export const useChangePassword = () => {
//   return useMutation({
//     mutationFn: async (passwordData: {
//       currentPassword: string;
//       newPassword: string;
//       confirmPassword: string;
//     }) => {
//       const response = await fetch(`${BASE_URL}/profile/password/${USER_ID}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(passwordData),
//       });

//       const data = await response.json();

//       if (!data.status) {
//         throw new Error(data.message || "Failed to change password");
//       }

//       return data.data;
//     },
//   });
// };

// // Bid History API (dummy implementation)
// export const useGetBidHistory = () => {
//   return useQuery({
//     queryKey: ["bidHistory"],
//     queryFn: async () => {
//       // In a real implementation, you would fetch from the API
//       // const response = await fetch(`${BASE_URL}/bids/history/${USER_ID}`)
//       // const data = await response.json()

//       // if (!data.status) {
//       //   throw new Error(data.message || "Failed to fetch bid history")
//       // }

//       // return data.data

//       // Dummy data for now

//       return [
//         {
//           id: 1,
//           auctionName: "Black Diamond",
//           sku: "#212-121",
//           bid: "$5,000.00",
//           biddingTime: "8 Dec, 2025",
//           status: "Live(10th)",
//         },
//         {
//           id: 2,
//           auctionName: "Black Diamond",
//           sku: "#212-121",
//           bid: "$5,000.00",
//           biddingTime: "8 Dec, 2025",
//           status: "Live(50th)",
//         },
//         {
//           id: 3,
//           auctionName: "Black Diamond",
//           sku: "#212-121",
//           bid: "$5,000.00",
//           biddingTime: "8 Dec, 2025",
//           status: "Win(1st)",
//         },
//         // Add more dummy data as needed
//       ];
//     },
//   });
// };
