import {  
  type GridApi,
  type IServerSideGetRowsParams,
  type IServerSideGetRowsRequest,
} from 'ag-grid-community';
import { Page } from './api';

type ApiFn<T> = (request: IServerSideGetRowsRequest, pageSize: number) => Promise<Page<T>>;

export class GridService<T> {
  rowModelType = 'serverSide';
  paginationPageSize = 50;
  paginationPageSizeSelector = [10, 25, 50, 100, 200, 500];
  gridId: string;
  api: ApiFn<T> | undefined = undefined;
  currentRows: T[] = [];
  gridApi: GridApi | undefined = undefined;

  constructor(
    gridId: string,
    api: ApiFn<T>,
  ) {
    this.gridId = gridId;
    this.api = api;
    this.onGridReady = this.onGridReady.bind(this);          
  }

  onGridReady(params: { api: GridApi }) {
    const gridApi = params.api;
    this.gridApi = gridApi;

    const api = this.api;

    const datasource = {
      getRows: async (params: IServerSideGetRowsParams) => {
        try {
          if (!api) {
            throw new Error('API is not defined');
          }

          let request = params.request;
          const page = await api(request, gridApi.paginationGetPageSize());

          this.currentRows = page.items;

          params.success({
            rowData: page.items,
            rowCount: page.itemsCount,
          });

        } catch (error) {
          console.error(error);

          params.fail();
        }
      },
    };

    params.api.setGridOption('serverSideDatasource', datasource);
  }
}
