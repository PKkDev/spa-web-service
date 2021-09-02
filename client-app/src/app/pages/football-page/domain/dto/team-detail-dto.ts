export interface TeamDetailDto {
    address: string;
    clubColors: string;
    email: string;
    lastUpdated: string;
    phone: string;
    website: string;
    squad: SquadDto[]
}

export interface SquadDto {
    name: string;
    position: string;
    nationality: string;
}