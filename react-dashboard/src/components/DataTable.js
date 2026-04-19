import React, { useState } from 'react';

const PAGE_SIZE = 10;

const DataTable = ({ data, columns }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const rows = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0
              ? <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No data to display.</td></tr>
              : rows.map((row, i) => (
                  <tr key={i}>
                    {columns.map(c => <td key={c.key}>{row[c.key]}</td>)}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next →</button>
      </div>
    </div>
  );
};

export default DataTable;
