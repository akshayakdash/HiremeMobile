import { DateTime } from "ionic-angular";

export interface PublishedJobDescModel {
    Name: string,
    Rating: Number,
    RequestType: string,
    Image:string;
    Location: string,
    Email: string,
    ContactNo: string,
    PublishedDate: string,
    Description: string,
    Gender: string,
    StaffType: string,
    Age: string,
    Experience: number,
    Skill: Array<any>,
    IsRead: boolean,
    AddtionalDesc:string,
    IsWrite:boolean,
    Sleep:number,
    Disponibility:string,
    Adults:number,
    Children:number,
    Localization:string,
    MinSalary:number,
    MaxSalary:number,

}