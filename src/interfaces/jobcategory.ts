import { Jobs } from "./job";

export interface JobCategory {
    JobCategoryId: number,
    CategoryName: string,
    Description: string,
    IconImage: string,
    Jobs: Array<Jobs>
}