import React from "react";
import styled from "styled-components";
const TableStyles = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  table {
    width: 100%;
  }
  thead {
    background-color: white;
  }
  th {
    white-space: nowrap;
  }
  th,
  td {
    vertical-align: middle;
  }
  th {
    padding: 20px 20px;
    font-weight: 600;
    text-align: left;
    border-bottom: thin solid #f7f7f7;
  }
  td {
    padding: 15px 20px;
  }
  tbody {
  }
`;
const Table = ({ children }) => {
  return (
    <TableStyles>
      <table>{children}</table>
    </TableStyles>
  );
};

export default Table;
