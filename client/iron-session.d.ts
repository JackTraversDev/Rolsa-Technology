type User = {
    userID: string;
}

declare module 'iron-session' {
    interface IronSessionData {
        user?: User;
    }
}