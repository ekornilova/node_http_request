const http = require("http");
const readline = require("readline");
const { stdin: input, stdout: output } = require("node:process");
const rl = readline.createInterface({ input, output });
const askCity = "Введите имя города:";
const printAskCity = () => {
  console.log(askCity);
};
rl.write(`${askCity}\n`);
rl.on("line", (input) => {
  if (input === "exit") {
    rl.close();
    return;
  }
  if (!input) {
    printAskCity();
    return;
  }
  http
    .get(
      `http://api.weatherstack.com/current?access_key=${process.env.API_KEY}&query="${input}"`,
      (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
          console.log("statusCode: ", statusCode);
          return;
        }
        res.setEncoding("utf8");
        let result = "";
        res.on("data", (data) => (result += data));
        res.on("end", () => {
          const parsedData = JSON.parse(result);
          console.log("result:", JSON.stringify(parsedData.request));
          printAskCity();
        });
      }
    )
    .on("error", (error) => {
      console.log(error);
      printAskCity();
    });
});

rl.on("close", function () {
  console.log("Вывод закончен");
});
