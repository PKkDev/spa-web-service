export interface DepartmentDto {
    id: number;
    name: string;
    createdAt: string;
    departments: DepartmentDto[];
}