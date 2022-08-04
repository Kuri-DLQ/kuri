import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process'
const __dirname = dirname(fileURLToPath(import.meta.url));

export const startDashboard = () => {
  exec('cd ' + __dirname + '/server && npm start')
}