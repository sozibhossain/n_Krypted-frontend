export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface Deal {
  _id: string;
  title: string;
  description: string;
  participationsLimit: number;
  price: number;
  location: string;
  images: string[];
  offers: string[];
  status: string;
  category: string;
  time?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  participations?: number;
}

export interface Booking {
  _id: string;
  userId: User;
  bookingId: string;
  dealsId: Deal;
  isBooked: boolean;
  notifyMe: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface BookingsResponse {
  success: boolean;
  count: number;
  data: Booking[];
  pagination: Pagination;
}
