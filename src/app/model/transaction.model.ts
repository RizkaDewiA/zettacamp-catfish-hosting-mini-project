export interface DetailTransaction {
    id: String,
    menu: {
        _id: String,
        amount: Number,
        total_recipe: Number,
        note: String,
        recipe_id: {
            id: String,
            image: String,
            price: String
        }
    }
    order_date: String,
    order_status: String,
    total: Number
} 