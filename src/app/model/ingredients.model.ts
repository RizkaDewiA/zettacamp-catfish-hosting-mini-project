enum StatusIngred {
    active,
    deleted
}

export interface Ingredients {
    id?: String
}

export interface Ingred extends Ingredients {
    name: String,
    stock: Number,
    status?: StatusIngred
}

