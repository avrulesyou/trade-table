import React, { useEffect, useState } from 'react';

interface Column {
  key: string;
  label: string;
}

interface Row {
  [key: string]: any;
}

interface TableProps {
  columns: Column[];
  data: Row[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.position_id}>
            {columns.map((column) => (
              <td key={column.key}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;