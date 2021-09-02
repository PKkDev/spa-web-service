export interface CompetitionsDto {
    count: number;
    filters: any;
    competitions: CompetitionDto[];
}

export interface CompetitionDto {
    id: number;
    name: string;
    emblemUrl: string;
    area: CompetitionAreaDto
    currentSeason: CompetitionSeasonDto
}

export interface CompetitionAreaDto {
    id: number;
    name: string;
}

export interface CompetitionSeasonDto {
    startDate: string;
    endDate: string;
    currentMatchday: number;
}