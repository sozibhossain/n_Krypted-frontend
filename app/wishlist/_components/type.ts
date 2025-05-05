export interface Seller {
    _id: string;
    username: string;
}

export interface Auction {
    _id: string;
    title: string;
    description: string;
    caratWeight: number;
    currentBid: number;
    images: string[];  // Added this
    startTime: string;
    endTime: string;
    seller: {
        _id: string;
        username: string;
    };
    status: string;
}



export interface Wishlist {
    _id: string;
    user: string;
    auctions: Auction[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface WishlistApiResponse {
    status: boolean;
    message: string;
    data: Wishlist;
}
