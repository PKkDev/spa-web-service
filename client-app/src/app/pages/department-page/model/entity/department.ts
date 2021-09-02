export class Department {
    public id: number;
    public name: string;
    public createdAt: string;
    public departments: Department[];

    public forAddNew: boolean;
    public parentId: number | null;

    constructor() {
        this.forAddNew = false;
        this.parentId = -1;

        this.id = -1;
        this.name = '';
        this.createdAt = '';
        this.departments = [];
    }
}