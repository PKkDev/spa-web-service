export class Teams {
    public id: number;
    public name: string;
    public crestUrl: string;
    public website: string;

    constructor(id: number, name: string, crestUrl: string, website: string) {
        this.id = id;
        this.name = name;
        this.crestUrl = crestUrl;
        this.website = website;
    }
}