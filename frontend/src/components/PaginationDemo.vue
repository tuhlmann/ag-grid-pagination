<script setup lang="ts">
import { ref } from 'vue'
import {ColDef, GridApi, IServerSideGetRowsParams} from "ag-grid-community";
import {AgGridVue} from "ag-grid-vue3";
import 'ag-grid-enterprise';
import {FixtureRecord} from "../interfaces/fixture.interface.ts";

defineProps<{ msg: string }>()

const gridId = ref('pagination-grid');
const rowModelType = ref('serverSide');
const paginationPageSize = ref(50);
const paginationPageSizeSelector = ref([10, 25, 50, 100, 200, 500]);

const onGridReady = async (params: { api: GridApi }) => {
  const url = "http://127.0.0.1:3000/api/fixtures";

  const datasource = {
    getRows: async (params: IServerSideGetRowsParams) => {
      try {

        let request = params.request;
        console.log('request', request);

        const startRow = request.startRow ?? 0
        const endRow = request.endRow ?? 0
        const pageSize = Math.max(0, endRow - startRow);

        const currentPage = Math.floor(startRow / pageSize) + 1;
        const queryString = `?page=${currentPage}&size=${pageSize}`;

        const response = await fetch(`${url}${queryString}`, {
          headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        try {
          const data = await response.json() as FixtureRecord[];
          console.log('response', data);

          params.success({
            rowData: data,
            rowCount: 500,
          });

        } catch (error) {
          console.error('Error fetching data', error);
        }
      } catch (error) {
        console.error(error);

        params.fail();
      }
    },
  };

  params.api.setGridOption('serverSideDatasource', datasource);
}

const colDefs = ref<(ColDef | undefined)[]>(
  [
    {
      field: 'autoincrement',
      headerName: 'Normative ID',
      maxWidth: 130,
    },
    {
      field: 'numberrange',
      headerName: 'Random Number',
      maxWidth: 130,
    },
    {
      field: 'alphanumeric',
      headerName: 'Random Alpha',
      maxWidth: 230,
    },
    {
      headerName: 'region',
      field: 'region',
      maxWidth: 230,
    },
    {
      headerName: 'Country',
      maxWidth: 230,
      field: 'country',
    },
    {
      headerName: 'Phone',
      field: 'phone',
      maxWidth: 230,
    },
  ],
);

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <div>Paginationsize: {{ paginationPageSize }}</div>
    <AgGridVue
      :id="gridId"
      class="ag-theme-quartz"
      domLayout="autoHeight"
      @grid-ready="onGridReady"
      :rowModelType="rowModelType"
      :columnDefs="colDefs"
      pagination
      :paginationPageSize="paginationPageSize"
      :paginationPageSizeSelector="paginationPageSizeSelector"
      :cacheBlockSize="paginationPageSize"
      :maxBlocksInCache="1"
    />
  </div>

  
</template>

<style scoped>
#pagination-grid {
  width: 95vw;
  height: 100%;
}
</style>
