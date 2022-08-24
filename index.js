#!/usr/bin/env node

import cli from "commander";
// import { init } from "./commands/init.js";
import { deploy } from "./commands/deploy.js";
import { view } from "./commands/view.js";

cli.description("Welcome to Kuri DLQ-as-a-Service! See the commands below or the documentation at https://github.com/Kuri-DLQ/kuri");
cli.name("kuri");
cli.usage("<command>");
cli.addHelpCommand(false);
cli.helpOption(false);

cli.parse(process.argv);

cli
  .command("deploy")
  .description(
    "-- Deploy Kuri Infrastructure"
  )
  .action(deploy);

  cli
  .command("view")
  .description(
    "-- View Kuri Dashboard"
  )
  .action(view)

cli.parse(process.argv);