export interface Menu {
    id?: String
}

export interface AddCart extends Menu {
    amount: Number,
    note?: String
}

enum statusRecipes {
    publish,
    unpublish,
    deleted
}

interface ArrayIngred{
    ingredient_id: String,
    stock_used: Number
}

export interface MenuRecipes {
    recipe_name: String,
    image: String,
    description: String,
    status: statusRecipes,
    ingredients: ArrayIngred[],
    price: Number
}
