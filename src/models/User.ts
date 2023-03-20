export class User {
    public id: number;
    public username: string;
    public emailAddress: string;

    constructor(id: number, username: string, emailAddress: string) {
        this.id = id;
        this.username = username;
        this.emailAddress = emailAddress;
    }
}