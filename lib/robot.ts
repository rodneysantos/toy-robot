import { Simulation } from './simulation';

/**
 * Thought process: Initially, this was an enum just like Rotation,
 * but I decided to convert it to an object
 * so that I don't have to create a new array of directions
 * to get the next direction when rotating the robot.
 */
export const Direction = {
  NORTH: 'NORTH',
  EAST: 'EAST',
  SOUTH: 'SOUTH',
  WEST: 'WEST',
}

export const enum Rotation {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

enum Command {
  PLACE = 'PLACE',
  MOVE = 'MOVE',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  REPORT = 'REPORT',
}

interface RobotState {
  x: number;
  y: number;
  direction: string;
}

export class Robot {
  private state: RobotState = { x: 0, y: 0, direction: Direction.NORTH };
  private sim: Simulation;
  private isPlaced = false;

  /**
   * Executes a command on the robot.
   * @param cmd The command to execute.
   * @param args The arguments for the command.
   * @param sim The simulation to execute the command on.
   */
  execute(cmd: string, args?: any, sim?: Simulation): Robot {
    if (cmd === Command.PLACE && sim) {
      const [x, y, direction] = args.split(',');
      this.place(sim, { x: parseInt(x), y: parseInt(y), direction });
    }

    if (cmd === Command.MOVE) {
      this.move();
    }

    if (cmd === Command.LEFT) {
      this.rotate(Rotation.LEFT);
    }

    if (cmd === Command.RIGHT) {
      this.rotate(Rotation.RIGHT);
    }

    if (cmd === Command.REPORT) {
      console.log(this.report());
    }

    return this;
  }

  /**
   * Moves the robot one unit in the direction it is facing.
   */
  move(): Robot {
    if (!this.isPlaced) {
      return this;
    }

    const { direction } = this.state;

    if (direction === Direction.NORTH) {
      if (this.state.y < this.sim.getDimensions()[1] - 1) {
        this.state.y++;
      }
    }

    if (direction === Direction.EAST) {
      if (this.state.x < this.sim.getDimensions()[0] - 1) {
        this.state.x++;
      }
    }

    if (direction === Direction.SOUTH) {
      if (this.state.y > 0) {
        this.state.y--;
      }
    }

    if (direction === Direction.WEST) {
      if (this.state.x > 0) {
        this.state.x--;
      }
    }

    return this;
  }

  /**
   * Places the robot on the table.
   * @param simulator The table to place the robot on.
   * @param state The state of the robot.
   */
  place(simulator: Simulation, state: RobotState): Robot {
    this.sim = simulator;

    if (!this.sim.isPositionValid([state.x, state.y])) {
      throw new Error('Robot is outside the table.');
    }

    if (!Object.values(Direction).includes(state.direction)) {
      throw new Error(`Given direction "${state.direction}" is invalid.`);
    }

    this.isPlaced = true;
    this.state = { ...state };
    return this;
  }

  /**
   * Returns the current position and direction of the robot.
   */
  report() {
    if (this.isPlaced) {
      const { x, y, direction } = this.state;
      return `${x},${y},${Direction[direction]}`;
    }

    return '';
  }

  /**
   * Rotates the robot 90 degrees to the left or right.
   * Loop back to the first direction using modulo.
   * @param {Rotation} rotation
   */
  rotate(rotation: Rotation): Robot {
    if (!this.isPlaced) {
      return this;
    }

    const directions = Object.keys(Direction);
    const currentDirection = directions.indexOf(this.state.direction);
    const totalDirections = directions.length;

    if (rotation === Rotation.LEFT) {
      const lastDirectionIndex = totalDirections - 1;
      const index = (currentDirection + lastDirectionIndex) % totalDirections;
      this.state.direction = directions[index];
    }

    if (rotation === Rotation.RIGHT) {
      const index = (currentDirection + 1) % totalDirections;
      this.state.direction = directions[index];
    }

    return this;
  }
}
