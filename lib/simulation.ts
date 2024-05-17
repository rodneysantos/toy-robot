import { Robot } from './robot';

export class Simulation {
  private robots: Robot[] = [];
  private dimensions: number[] = [];

  /**
   * Creates a new simulation.
   * @param xSize x-axis size of the table.
   * @param ySize y-axis size of the table.
   */
  constructor(xSize = 5, ySize = 5) {
    this.dimensions = [xSize, ySize];
  }

  /**
   * Returns the dimensions of the table.
   * @param robot The robot to add.
   */
  getDimensions(): number[] {
    return this.dimensions;
  }

  /**
   * Checks if the position is inside the table.
   * @param pos The position to check.
   * @returns True if the position is inside the table, false otherwise.
   * @throws Error if the position is invalid.
   */
  isPositionValid(pos: number[]): boolean {
    if (pos.length !== 2) {
      throw new Error("Invalid position");
    }

    const [x, y] = this.dimensions;
    const [posX, posY] = pos;
    return posX >= 0 && posX < x && posY >= 0 && posY < y;
  }
}
