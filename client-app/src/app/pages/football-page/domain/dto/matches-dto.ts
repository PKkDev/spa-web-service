export interface MatchesDto {
    matches: MatchDto[];
    filters: any;
    count: number;
}

export interface MatchDto {
    id: number;
    status: string;
    utcDate: string;
    score: ScoreDto;
    homeTeam: HomeTeamDto;
    awayTeam: AwayTeamDto;
}

export interface ScoreDto {
    winner: string;
    fullTime: FullTimeDto;
}

export interface FullTimeDto {
    homeTeam: number;
    awayTeam: number;
}

export interface HomeTeamDto {
    name: string;
    id: number;
}

export interface AwayTeamDto {
    name: string;
    id: number;
}