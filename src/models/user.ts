export class User {
    userName: string;
    name: string;
    email: string;
    phone: object;
    age: number;
    school: string;
    speciality: string;
    address: object;
    gender: boolean;
    role: string;
    description: string;
    experience: string;
    avatar_url: string;
    file_url: string;
    favs: object;
    password: string;
    passwordConfirm: string;

    public constructor(Name: string, UserName, Phone: object, Email: string, Age: number, School: string, Speciality: string, Address: object, Gender: boolean,  Description: string, Experience: string, File_url: string, Avatar_url: string) {
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
        this.file_url = File_url;
        this.speciality = Speciality;
    }
}
