// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const storeState = sqliteTable("store_state", {
  id: text("id").primaryKey(),
  version: integer("version").notNull().default(0),
  payload: text("payload").notNull(),
});
