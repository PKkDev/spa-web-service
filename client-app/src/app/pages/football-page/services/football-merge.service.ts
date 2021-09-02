import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { CompetitionsDto } from '../domain/dto/competitions-dto';
import { MatchesDto } from '../domain/dto/matches-dto';
import { TeamDetailDto } from '../domain/dto/team-detail-dto';
import { TeamsDto } from '../domain/dto/teams-dto';
import { Competition, SeasonInfo } from '../domain/model/competition';
import { Matches, Team } from '../domain/model/matches';
import { Squad, TeamDetail } from '../domain/model/team-detail';
import { Teams } from '../domain/model/teams';

@Injectable({
  providedIn: 'root'
})
export class FootballMergeService {

  constructor() { }
  /**
   * merge CompetitionsDto to local model
   * @param httpResponse http response from football api
   * @returns competition collection
   */
  public mergeCompetitions(httpResponse: CompetitionsDto): Competition[] {
    // console.log(httpResponse);

    const result: Competition[] = [];

    for (const comp of httpResponse.competitions) {

      let seasonInfo: SeasonInfo | null = null;
      if (comp.currentSeason)
        seasonInfo = new SeasonInfo(comp.currentSeason.startDate, comp.currentSeason.endDate, comp.currentSeason.currentMatchday);

      result.push(new Competition(comp.area.id, comp.id, comp.area.name, comp.name, comp.emblemUrl, seasonInfo))
    }

    // console.log(result);
    return result;
  }

  /**
   * merge TeamsDto to local model
   * @param httpResponse http response from football api
   * @returns teams collection
   */
  public mergeTeams(httpResponse: TeamsDto): Teams[] {
    // console.log(httpResponse);

    const result: Teams[] = [];

    for (const team of httpResponse.teams) {
      result.push(new Teams(team.id, team.name, team.crestUrl, team.website))
    }

    // console.log(result);
    return result;
  }

  /**
   * merge TeamDetailDto to local model
   * @param httpResponse http response from football api
   * @returns model detail for team
   */
  public mergeTeamDetail(httpResponse: TeamDetailDto): TeamDetail {
    // console.log(httpResponse);

    const mergedDate = moment(httpResponse.lastUpdated, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY')
    const result: TeamDetailDto = new TeamDetail(httpResponse.address, httpResponse.clubColors, httpResponse.email,
      mergedDate, httpResponse.phone, httpResponse.website, []);

    for (const player of httpResponse.squad)
      result.squad.push(new Squad(player.name, player.position, player.nationality));

    // console.log(result);
    return result;
  }

  /**
   * merge MatchesDto to local model
   * @param httpResponse http response from football api
   * @returns  matches collection
   */
  public mergeMatches(httpResponse: MatchesDto): Matches[] {
    // console.log(httpResponse);

    const result: Matches[] = [];

    for (const match of httpResponse.matches) {
      const mergedDate = moment(match.utcDate, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY HH:mm');

      let homeTeam: Team = new Team(match.homeTeam.name, match.homeTeam.id, 'none', 0);
      let awayTeam: Team = new Team(match.awayTeam.name, match.awayTeam.id, 'none', 0);
      if (match.score.winner) {
        homeTeam.goals = match.score.fullTime.homeTeam;
        homeTeam.goals = match.score.fullTime.awayTeam;
        if (match.score.winner == 'HOME_TEAM')
          homeTeam.status = 'winner';
        else
          awayTeam.status = 'winner';
      }
      result.push(new Matches(match.id, match.status, mergedDate, homeTeam, awayTeam));
    }

    // console.log(result);
    return result;
  }

}
