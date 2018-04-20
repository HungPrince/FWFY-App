import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file';

@Injectable()

export class FileHelper {

    constructor(private file: File) {

    }

    read(bstr: string) {
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        return data;
    }

    wirte(data: any[][], name: string): XLSX.WorkBook {
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, name);
        return wb;
    }

    onFileChange(evt: any) {
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length != 1) {
            throw Error('Can not use multiple file');
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            let bstr: string = e.target.result;
            this.read(bstr);
        }
        reader.readAsBinaryString(target.files[0])
    }

    async export(data: any[][], filename: string) {
        const wb: XLSX.WorkBook = this.wirte(data, filename);

        try {
            const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob: Blob = new Blob([wbout], { type: 'application/octet-stream' });

            const target: string = this.file.documentsDirectory || this.file.externalDataDirectory ||
                this.file.dataDirectory || '';
            const dentry = await this.file.resolveDirectoryUrl(target);
            const url: string = dentry.nativeURL || '';

            await this.file.writeFile(url, filename, blob, { replace: true });
        } catch (e) {
            if (e.message.match('/It was determined/')) {
                XLSX.writeFile(wb, filename);
            }
            else alert(`Error: ${e.message}`);
        }
    }

    async import(fileName: string) {
        try {
            let target: string = this.file.documentsDirectory || this.file.externalDataDirectory
                || this.file.dataDirectory || '';
            let dentry = await this.file.resolveDirectoryUrl(target);
            let url: string = dentry.nativeURL || '';
            let bstr = await this.file.readAsBinaryString(url, fileName);
            this.read(bstr);
        }
        catch (e) {
            let m: string = e.message;
            console.log(m);
        }
    }
}