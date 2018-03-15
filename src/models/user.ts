export class User {
    id: string;
    name: string;
    email: string;
    phone: object;
    age: number;
    school: string;
    address: {
        city: string,
        district: string,
        street: string
    };
    gender: boolean;
    licenses: object;
    description: string;
    experience: string;
    avatar_url: string;
    file_url: string;
    favs: object;
    password: string,
    passwordConfirm: string;
}
