import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompetitionsDto } from '../domain/dto/competitions-dto';
import { MatchesDto } from '../domain/dto/matches-dto';
import { TeamDetailDto } from '../domain/dto/team-detail-dto';
import { TeamsDto } from '../domain/dto/teams-dto';

@Injectable({
  providedIn: 'root'
})
export class FootballApiService {

  private apiUrl = environment.footballApiUrl;
  private apiKey = environment.footballApiKey;

  constructor(private httpClient: HttpClient) { }

  /**
   * get observable for request to football api - get competitions
   * @returns Observable<CompetitionsDto>
   */
  public getCompetitions(): Observable<CompetitionsDto> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.get<CompetitionsDto>(this.apiUrl + 'competitions', httpOptions);
  }

  /**
   * get observable for request to football api - get competitions teams
   * @param id competitions id
   * @returns Observable<TeamsDto>
   */
  public getCompetitionTeams(id: number): Observable<TeamsDto> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.get<TeamsDto>(this.apiUrl + `competitions/${id}/teams`, httpOptions);
  }

  /**
   * get observable for request to football api - get competitions matches
   * @param id competitions id
   * @returns Observable<MatchesDto>
   */
  public getCompetitionMatches(id: number): Observable<MatchesDto> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.get<MatchesDto>(this.apiUrl + `competitions/${id}/matches`, httpOptions);
  }

  /**
   * get observable for request to football api - get team matches
   * @param id team id
   * @returns Observable<MatchesDto>
   */
  public getTeamMatches(id: number): Observable<MatchesDto> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.get<MatchesDto>(this.apiUrl + `teams/${id}/matches`, httpOptions);
  }

  /**
   * get observable for request to football api - get team detail
   * @param id team id
   * @returns Observable<TeamDetailDto>
   */
  public getTeamDetail(id: number): Observable<TeamDetailDto> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.get<TeamDetailDto>(this.apiUrl + `teams/${id}`, httpOptions);
  }

  /**
   * get basic http optons for request to football api
   * @returns  http options
   */
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'X-Auth-Token': this.apiKey
      }),
      params: new HttpParams()
    };
  }

}
