import clc from "cli-color";

export class Logger {
  private static lastLogTIme = Date.now();
  static log(message: string, context: string = "") {
    const timestrap = new Date().toISOString();
    const pid = process.pid;
    const timeDiff = Date.now() - this.lastLogTIme;
    console.log(
      `[${clc.green("Nest")}]  ${clc.green(pid)} - ${clc.white(
        timestrap
      )}     ${clc.green("LOG")} ${clc.yellow(`[${context}]`)} ${clc.green(
        message
      )}  ${clc.yellow(`+${timeDiff}ms`)}`
    );
    this.lastLogTIme = Date.now();
  }
}
