export class User {
    uid?: string;
    userName: string;
    name: string;
    email: string;
    phone: object;
    age: number;
    school: string;
    specialized: string;
    address: object;
    city: string;
    gender: boolean;
    roles: string;
    description: string;
    experience: string;
    avatar_url: string;
    favs: object;
    password: string;
    passwordConfirm: string;
    createdAt: Date;
    updatedAt: Date;

    public constructor(Role: string, Name: string, UserName, Phone: object, Email: string, Age: number, School: string, Speciality: string, Address: object, Gender: boolean, Description: string, Experience: string, Avatar_url: string) {
        this.roles = Role;
        this.name = Name;
        this.userName = UserName;
        this.email = Email;
        this.phone = Phone;
        this.age = Age;
        this.school = School;
        this.address = Address;
        this.gender = Gender;
        this.description = Description;
        this.experience = Experience;
        this.avatar_url = Avatar_url;
        this.specialized = Speciality;
    }
}
