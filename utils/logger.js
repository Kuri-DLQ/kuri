import ora from 'ora';
import chalk from 'chalk';

class Logger {
  spin(msg) {
    const spinner = ora(msg)
    spinner.color = 'red'
    return spinner.start()
  }

  info(msg) {
    ora().info(msg);
  }

  error(msg) {
    ora().fail(chalk.bold.red(msg));
  }
}

const log = new Logger();

export default log