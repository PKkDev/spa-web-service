export interface TeamsDto {
    teams: teamDto[];
    filters: any;
    count: number;
}

export interface teamDto {
    id: number;
    name: string;
    crestUrl: string;
    website: string;
}