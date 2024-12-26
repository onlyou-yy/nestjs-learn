import clc from "cli-color";

export class Logger {
  static log(message: string, context: string = "") {
    const timestrap = new Date().toISOString();
    const pid = process.pid;
    console.log(
      `[${clc.green("Nest")}]  ${clc.green(pid)} - ${clc.white(
        timestrap
      )}     ${clc.green("LOG")} ${clc.yellow(`[${context}]`)} ${clc.green(
        message
      )}`
    );
  }
}
