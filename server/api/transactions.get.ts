import { db } from '../util/db';
export default defineEventHandler(() => db.transactions)