<script setup lang="ts">
import { ref } from 'vue'
import {ColDef} from "ag-grid-community";
import {AgGridVue} from "ag-grid-vue3";
import 'ag-grid-enterprise';
import {FixtureRecord} from "../interfaces/fixture.interface.ts";
import { GridService } from '../services/GridService.ts';
import { getFixtures } from '../services/api.ts';

defineProps<{ msg: string }>()

const gridId = ref('pagination-grid');

const gridService = ref<GridService<FixtureRecord>>(
  new GridService(gridId.value, getFixtures),
);

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
    <div>Paginationsize: {{ gridService.paginationPageSize }}</div>
    <AgGridVue
      :id="gridId"
      class="ag-theme-quartz"
      domLayout="autoHeight"
      @grid-ready="gridService.onGridReady"
      :rowModelType="gridService.rowModelType"
      :columnDefs="colDefs"
      pagination      
      :paginationPageSize="gridService.paginationPageSize"
      :paginationPageSizeSelector="gridService.paginationPageSizeSelector"
      :cacheBlockSize="gridService.paginationPageSize"
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
