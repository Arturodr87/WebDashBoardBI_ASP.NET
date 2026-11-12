import React, { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Database,
  ExternalLink,
} from 'lucide-react';

interface DataTableProps {
  title: string;
  rows: any[];
  onOpenInSqlConsole?: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  rows,
  onOpenInSqlConsole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/70 text-center py-12">
        <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">Sin datos para mostrar</p>
        <p className="text-xs text-slate-400">Ejecute una consulta SQL para poblar la tabla</p>
      </div>
    );
  }

  const columns = Object.keys(rows[0]);

  // Filter rows based on search
  const filteredRows = rows.filter((row) => {
    if (!searchTerm) return true;
    return columns.some((col) =>
      String(row[col] ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  // Sort rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA === valB) return 0;
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleSort = (col: string) => {
    if (sortField === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(col);
      setSortAsc(true);
    }
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        columns.join(','),
        ...sortedRows.map((r) =>
          columns
            .map((c) => {
              const val = r[c] ?? '';
              return `"${String(val).replace(/"/g, '""')}"`;
            })
            .join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">
            {sortedRows.length} registros obtenidos vía SQL Server
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar tabla..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>

          {onOpenInSqlConsole && (
            <button
              onClick={onOpenInSqlConsole}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>SQL</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto max-h-80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200/80 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-5 py-3 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedRows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-blue-50/40 transition-colors group"
              >
                {columns.map((col) => {
                  const val = row[col];
                  const isNumber = typeof val === 'number';
                  const isStatus = col.toLowerCase().includes('estado');
                  return (
                    <td
                      key={col}
                      className="px-5 py-3 whitespace-nowrap text-slate-700 font-medium"
                    >
                      {isStatus ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {String(val)}
                        </span>
                      ) : isNumber && val > 1000 ? (
                        <span className="font-semibold text-slate-900">
                          ${new Intl.NumberFormat('es-EC').format(val)}
                        </span>
                      ) : (
                        String(val ?? '—')
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
