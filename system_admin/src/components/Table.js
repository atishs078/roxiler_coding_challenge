import React, { useState, useEffect } from 'react';

const Table = ({ columns, data, emptyMessage = "No data found", filterKeys = [] }) => {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (!search) {
      setFilteredData(data);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = data.filter((row) =>
        filterKeys.some((key) =>
          String(row[key]).toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    }
  }, [search, data, filterKeys]);

  return (
    <div className="overflow-x-auto">
      {/* Filter Input */}
      {filterKeys.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Apply filter just type you want.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-full"
          />
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="py-2 px-4 border-b text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.key} className="py-2 px-4 border-b">
                    {row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
