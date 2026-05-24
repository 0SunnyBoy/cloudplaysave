/**
 * Sobe os 4 microsserviços em processos filhos com prefixo nos logs.
 * Uso: `node start-all.js`  (ou `npm run start:all`)
 */
const { spawn } = require('child_process');
const path      = require('path');

const SERVICES = [
  { name: 'AUTH',    dir: 'auth-service',    color: '\x1b[36m' },
  { name: 'CATALOG', dir: 'catalog-service', color: '\x1b[33m' },
  { name: 'ORDER',   dir: 'order-service',   color: '\x1b[35m' },
  { name: 'GATEWAY', dir: 'api-gateway',     color: '\x1b[32m' },
];
const RESET = '\x1b[0m';

const children = SERVICES.map(s => {
  const child = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, s.dir),
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });
  const prefix = `${s.color}[${s.name}]${RESET}`;
  child.stdout.on('data', d => d.toString().split('\n').filter(Boolean).forEach(l => console.log(`${prefix} ${l}`)));
  child.stderr.on('data', d => d.toString().split('\n').filter(Boolean).forEach(l => console.error(`${prefix} ${l}`)));
  child.on('exit', code => console.log(`${prefix} encerrado (code=${code})`));
  return child;
});

const shutdown = () => {
  console.log('\nEncerrando microsserviços...');
  children.forEach(c => c.kill('SIGTERM'));
  setTimeout(() => process.exit(0), 500);
};
process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);
