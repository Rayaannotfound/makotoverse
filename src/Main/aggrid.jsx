import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

class MyGrid extends Component {
  constructor(props) {
    super(props);

    // State contains column definitions and row data
    this.state = {
      columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" },
      ],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 },
      ],
    };

    // Binding the method
    this.onGridReady = this.onGridReady.bind(this);
    this.autoSizeAllColumns = this.autoSizeAllColumns.bind(this);
  }

  // Store a reference to the grid's API when the grid is ready
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Automatically size the columns after the grid is ready
    this.autoSizeAllColumns();
  }

  // Method to auto-size all columns based on their content
  autoSizeAllColumns() {
    const allColumnIds = this.gridColumnApi
      .getAllColumns()
      .map((column) => column.getId());
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  render() {
    return (
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          onGridReady={this.onGridReady}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          defaultColDef={{ resizable: true }} // Make columns resizable
        />
      </div>
    );
  }
}

export default MyGrid;
