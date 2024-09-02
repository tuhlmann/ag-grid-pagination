import { IServerSideGetRowsRequest } from "ag-grid-community";
import { FixtureRecord } from "../interfaces/fixture.interface";

export interface Page<T> {
  items: T[];
  itemsCount: number;
  currentPage: number;
}

export const FIXTURE_COUNT = 500;

const fixtureUrl = "http://127.0.0.1:3000/api/fixtures";

async function fetchFixtures(currentPage: number, queryString: string): Promise<Page<FixtureRecord>> {

  const response = await fetch(`${fixtureUrl}${queryString}`, {
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as FixtureRecord[];
  console.log('response', data);

  return {
    items: data,
    itemsCount: FIXTURE_COUNT,
    currentPage
  };    
};

export async function getFixtures(request: IServerSideGetRowsRequest, _pageSize: number): Promise<Page<FixtureRecord>> {
  console.log('request', request);

  const startRow = request.startRow ?? 0
  const endRow = request.endRow ?? 0

  const pageSize = Math.max(0, endRow - startRow);

  // const itsPageSize = pageSize; // It works with this
  const itsPageSize = _pageSize; // It fails with this

  console.log("GridApi pageSize:", _pageSize);
  console.log("Calculated pageSize", pageSize);
  console.log("Used pageSize", itsPageSize);
  console.log("startRow / endRow", startRow, endRow);

  const currentPage = Math.floor(startRow / itsPageSize) + 1;
  const queryString = `?page=${currentPage}&size=${itsPageSize}`;

  return fetchFixtures(currentPage, queryString);  
}

