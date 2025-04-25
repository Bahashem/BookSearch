export interface UserAuthRequest {
    userContext: UserContext;
}   
export interface UserContext {
    user: {
        _id: string;
        username?: string;
        email?: string;
    };
}
export interface UserPayload {      
    _id: string;
    username?: string;
    email?: string;
}