export interface User {
    id?:String
}

export interface UserLogin extends User{
    email: String,
    password?: String
}

export interface Register extends UserLogin {
    firstname: String,
    lastname: String
}
