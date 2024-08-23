import https from "https";
import { CronJob } from "cron";
const backEndUrl = "https://api.pedagang-ecommerce.site";
export const schedulerJob = new CronJob("*/13 * * * *", async () => {
  console.log("Restarting server");
  https
    .get(backEndUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Server Restarted");
      } else {
        console.log(
          `Failed to restart server with status code ${res.statusCode}`
        );
      }
    })
    .on("error", (err) => {
      console.error("Error: ", err.message);
    });
});
