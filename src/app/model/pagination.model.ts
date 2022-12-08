export interface Pagination {
    page: Number,
    limit: Number
}

export interface PaginStock extends Pagination {
    stock: Number
}
