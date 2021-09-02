export class Matches {
    public id: number;
    public status: string;
    public utcDate: string;
    public homeTeam: Team;
    public awayTeam: Team;

    constructor(id: number, status: string, utcDate: string, homeTeam: Team, awayTeam: Team) {
        this.id = id;
        this.status = status;
        this.utcDate = utcDate;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
    }
}

export class Team {
    public name: string;
    public id: number;
    public status: string;
    public goals: number;

    constructor(name: string, id: number, status: string, goals: number) {
        this.name = name;
        this.id = id;
        this.status = status;
        this.goals = goals;
    }
}