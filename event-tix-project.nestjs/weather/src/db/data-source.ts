// import { DataSource } from "typeorm";
// import { Event } from "../../../src/Event/entities/Event.entities.js";
// import { Booking } from "../../../src/Book/entities/book.entities.js";

// // أضف باقي الـ Entities هنا لو عايز تستخدمها في الـ MCP أو الـ API
// // import { User } from "../Auth/entities/user.entities.js";
// // import { EventCategory } from "../Category/entities/Category.entities.js";
// // إلخ...

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "password",
//   database: "events_db",
//   entities: [
//     Event,
//     Booking,
//     // أضف باقي الـ Entities هنا
//   ],
//   synchronize: true, // خليها false في الـ production
//   logging: false,
// });