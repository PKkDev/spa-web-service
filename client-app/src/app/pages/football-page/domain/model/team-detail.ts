export class TeamDetail {
    public address: string;
    public clubColors: string;
    public email: string;
    public lastUpdated: string;
    public phone: string;
    public website: string;
    public squad: Squad[]

    constructor(address: string, clubColors: string, email: string, lastUpdated: string, phone: string, website: string, squad: Squad[]) {
        this.address = address;
        this.clubColors = clubColors;
        this.email = email;
        this.lastUpdated = lastUpdated;
        this.phone = phone;
        this.website = website;
        this.squad = squad;
    }
}

export class Squad {
    public name: string;
    public position: string;
    public nationality: string;

    constructor(name: string, position: string, nationality: string) {
        this.name = name;
        this.position = position;
        this.nationality = nationality;
    }
}