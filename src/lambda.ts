import serverless from "serverless-http";
import { app } from "./app";

export const handler = serverless(app);

// export const handler = serverless(app, {
//   request(request, _event, _context) {
//     console.log("REQUEST RIGHT HERE ------->", JSON.stringify(request.body));
//   },

//   async response(response, _event, _context) {
//     // the return value is always ignored
//     return new Promise((resolve) => {
//       console.log("RESPONSE RIGHT HERE HEYOOO!!!", response);
//       response.statusCode = 200;
//       resolve(response.body);
//     });
//   },
// });
