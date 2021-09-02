import * as moment from "moment";
import { TypeViewPeriodRecord } from "./type-view-period-record";

export class TodoRecordInfoDto {
    public text: string;
    public dateCreate: string;
    public id: number;

    constructor() {
        this.id = -1;
        this.dateCreate = '';
        this.text = '';
    }
}

export class GetToDoQuery {
    public typeView: TypeViewPeriodRecord;
    public userId: number;
    public dateFilter: DateFIlterDto;

    constructor() {
        this.dateFilter = new DateFIlterDto([]);
        this.userId = -1;
        this.typeView = TypeViewPeriodRecord.Today
    }
}

export class DateFIlterDto {
    public start: string | null;
    public end: string | null;

    constructor(dates: string[]) {
        if (dates.length == 0) {
            this.start = null;
            this.end = null
        }
        else {
            if (dates[0] == 'reset') {
                this.start = null;
                this.end = null
            }
            else {
                this.start = moment(dates[0]).format('YYYY-MM-DDTHH:mm:ss')
                this.end = moment(dates[1]).format('YYYY-MM-DDTHH:mm:ss')
            }
        }
    }
}