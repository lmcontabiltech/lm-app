import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export type Row = Record<string, any>;
export type Header = { key: string; label: string };

@Injectable({ providedIn: 'root' })
export class ExportService {
  toCsv(filename: string, data: Row[], headers?: Header[], delimiter = ';') {
    if (!data?.length) return;

    const cols = headers?.length
      ? headers.map((h) => h.key)
      : Object.keys(data[0]);
    const head = headers?.length ? headers.map((h) => h.label) : cols;

    const lines = [
      head.join(delimiter),
      ...data.map((row) =>
        cols.map((k) => this.escapeCsv(row[k])).join(delimiter)
      ),
    ];

    const csv = lines.join('\r\n'); // quebra de linha p/ Excel no Windows
    const blob = new Blob(['\ufeff' + csv], {
      // BOM p/ acentos no Excel
      type: 'text/csv;charset=utf-8;',
    });
    FileSaver.saveAs(blob, this.ensureExt(filename, 'csv'));
  }

  toXlsx(
    filename: string,
    data: Row[],
    headers?: Header[],
    sheetName = 'Dados'
  ) {
    if (!data?.length) return;

    const cols = headers?.length
      ? headers.map((h) => h.key)
      : Object.keys(data[0]);
    const head = headers?.length ? headers.map((h) => h.label) : cols;

    const aoa = [head, ...data.map((row) => cols.map((k) => row[k] ?? ''))];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, this.ensureExt(filename, 'xlsx'));
  }

  // helpers
  private ensureExt(name: string, ext: string) {
    return name.toLowerCase().endsWith(`.${ext}`) ? name : `${name}.${ext}`;
  }

  private escapeCsv(value: any) {
    if (value === null || value === undefined) return '""';
    const v = String(value).replace(/\r?\n/g, ' ').replace(/"/g, '""');
    return `"${v}"`;
  }
}
