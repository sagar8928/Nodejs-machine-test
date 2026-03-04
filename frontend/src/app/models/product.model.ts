export interface Product {
    ProductId: number;
    ProductName: string;
    CategoryId: number;
    CategoryName: string;  
}

// For pagination response 
export interface ProductResponse {
    success: boolean;
    data: Product[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalRecords: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}