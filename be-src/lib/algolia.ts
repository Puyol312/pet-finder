import algoliasearch from "algoliasearch";
import dotenv from "dotenv";

import { API_KEY, APP_ID } from "../config";

const client = algoliasearch(APP_ID, API_KEY);
const index = client.initIndex('prod_REPORT');

export { index }