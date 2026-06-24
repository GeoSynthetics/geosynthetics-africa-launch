import { execSync } from 'child_process';

try {
  console.log("--- netstat -ano | findstr LISTENING ---");
  const netstat = execSync('netstat -ano', { encoding: 'utf8' });
  const listening = netstat.split('\n').filter(line => line.includes('LISTENING'));
  console.log(listening.slice(0, 30).join('\n'));
} catch (err: any) {
  console.error(err.message);
}
