export class TodoRecordInfo {
    public text: string;
    public date: string;
    public id: number;
    public isNew: boolean;

    constructor() {
        this.id = -1;
        this.isNew = false;
        this.text = '';
        this.date = '';
    }
}