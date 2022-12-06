export interface RecipeMenu {
    id: String,
    status: statusIngred,
    available: Number, 
    ingredients: {
        ingredient_id: {
            id: String,
            name: String,
            status: statusStock, 
            stock: Number,
        }
        stock_used: Number,
    }
    price: Number,
    recipe_name: String,
    description: String,
    image: String
}
