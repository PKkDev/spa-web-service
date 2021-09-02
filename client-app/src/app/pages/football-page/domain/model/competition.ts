export class Competition {
    public areaId: number;
    public competitionId: number;
    public areaName: string;
    public competitionName: string;
    public seasonInfo: SeasonInfo | null;
    public emblemUrl: string;

    constructor(areaId: number, competitionId: number,
        areaName: string, competitionname: string, emblemUrl: string,
        seasonInfo: SeasonInfo | null) {
        this.areaId = areaId;
        this.competitionId = competitionId;
        this.areaName = areaName;
        this.competitionName = competitionname;
        this.emblemUrl = emblemUrl;
        this.seasonInfo = seasonInfo;
    }
}

export class SeasonInfo {
    public startDate: string;
    public endDate: string;
    public day: number;

    constructor(startDate: string, endDate: string, day: number) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.day = day;
    }
}