import { execFile } from 'child_process'

export const view = async () => {
  console.log('💻 Kuri Dashboard is starting...\n')
  console.log('❎ Press "ctrl + c" to close the dashboard\n')
  execFile("./startDashboard.js");
}
