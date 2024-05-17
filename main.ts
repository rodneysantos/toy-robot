import { readFileSync } from 'fs';
import { Robot } from './lib/robot';
import { Simulation } from './lib/simulation';

function main() {
  const instructions = readFileSync('commands.txt', 'utf-8').split('\r\n\r\n');

  for (const instruction of instructions) {
    const simulator = new Simulation();
    const robot = new Robot();
    const commands = instruction.split('\r\n');

    for (const cmd of commands) {
      const [command, args] = cmd.split(' ');
      robot.execute(command, args, simulator);
    }
  }
}

main();
