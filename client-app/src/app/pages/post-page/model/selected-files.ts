export class SelectedFiles {
    public file: File;
    public name: string;
    public size: number;
    
    constructor() {
        this.name = '';
        this.size = 0;
        this.file = new File([], '')
    }
}