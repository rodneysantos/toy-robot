import { describe, expect, it, vi } from 'vitest';
import { Direction, Robot, Rotation } from './robot';
import { Simulation } from './simulation';

describe('Robot', () => {
  const simulator = {
    getDimensions: () => [5, 5],
    isPositionValid: () => true,
  } as unknown as Simulation;

  it('moves the robot one unit in the direction it is facing', () => {
    // arrange
    const robot = new Robot();

    // act
    const robotState = robot
      .place(simulator, { x: 0, y: 0, direction: Direction.NORTH })
      .move()
      .report();

    // assert
    expect(robotState).toBe('0,1,NORTH');
  });

  it('ignores the command if the robot is at the edge of the table', () => {
    // arrange
    const robot = new Robot();
    const tests = [
      { state: { x: 0, y: 4, direction: Direction.NORTH }, expected: '0,4,NORTH' },
      { state: { x: 0, y: 3, direction: Direction.NORTH }, expected: '0,4,NORTH' },
      { state: { x: 4, y: 0, direction: Direction.EAST }, expected: '4,0,EAST' },
      { state: { x: 0, y: 0, direction: Direction.SOUTH }, expected: '0,0,SOUTH' },
      { state: { x: 0, y: 0, direction: Direction.WEST }, expected: '0,0,WEST' },
    ];

    for (const t of tests) {
      // act
      const robotState = robot.place(simulator, t.state).move().report();

      // assert
      expect(robotState).toBe(t.expected);
    }
  });

  it('places the robot at the given position', () => {
    // assemble
    const robot = new Robot();

    // act
    const robotState = robot
      .place(simulator, { x: 0, y: 0, direction: Direction.NORTH })
      .report();

    // assert
    expect(robotState).toBe('0,0,NORTH');
  });

  it('throws an error if the position is invalid', () => {
    // assemble
    const sim = { isPositionValid: () => false } as unknown as Simulation;
    const robot = new Robot();

    // act
    const place = () => robot.place(sim, { x: -1, y: -1, direction: Direction.NORTH });

    // assert
    expect(place).toThrowError('Robot is outside the table.');
  });

  it('throws an error if the direction is invalid', () => {
    // assemble
    const robot = new Robot();

    // act
    const place = () => robot.place(
      simulator,
      { x: 0, y: 0, direction: 'NORTH EAST' },
    );

    // assert
    expect(place).toThrowError('Given direction "NORTH EAST" is invalid.');
  });

  it('reports the current state', () => {
    // assemble
    const robot = new Robot();

    // act
    robot.place(simulator, { x: 0, y: 0, direction: Direction.NORTH });
    const state = robot.report();

    // assert
    expect(state).toBe('0,0,NORTH');
  });

  it('rotates the robot to the left', () => {
    // assemble
    const tests = [
      { direction: Direction.NORTH, expected: Direction.WEST },
      { direction: Direction.WEST, expected: Direction.SOUTH },
      { direction: Direction.SOUTH, expected: Direction.EAST },
      { direction: Direction.EAST, expected: Direction.NORTH },
    ];

    for (const t of tests) {
      // act
      const robot = new Robot();
      const robotState = robot
        .place(simulator, { x: 0, y: 0, direction: t.direction })
        .rotate(Rotation.LEFT)
        .report();

      // assert
      expect(robotState).toBe(`0,0,${t.expected}`);
    }
  });

  it('rotates the robot to the right', () => {
    // assemble
    const tests = [
      { direction: Direction.NORTH, expected: Direction.EAST },
      { direction: Direction.EAST, expected: Direction.SOUTH },
      { direction: Direction.SOUTH, expected: Direction.WEST },
      { direction: Direction.WEST, expected: Direction.NORTH },
    ];

    for (const t of tests) {
      // act
      const robot = new Robot();
      const robotState = robot
        .place(simulator, { x: 0, y: 0, direction: t.direction })
        .rotate(Rotation.RIGHT)
        .report();

      // assert
      expect(robotState).toBe(`0,0,${t.expected}`);
    }
  });

  it('moves the robot in a circle', () => {
    // assemble
    const robot = new Robot();

    // act
    const robotState = robot
      .place(simulator, { x: 0, y: 0, direction: Direction.NORTH })
      .move() // [0,1]
      .rotate(Rotation.RIGHT)
      .move() // [1,1]
      .rotate(Rotation.RIGHT)
      .move() // [1,0]
      .rotate(Rotation.RIGHT)
      .move() // [0,0]
      .rotate(Rotation.RIGHT)
      .report();

    // assert
    expect(robotState).toBe('0,0,NORTH');
  });

  it('moves the robot to the top right corner', () => {
    // assemble
    const robot = new Robot();

    // act
    const robotState = robot
      .place(simulator, { x: 0, y: 0, direction: Direction.NORTH })
      .move() // [0,1]
      .rotate(Rotation.RIGHT)
      .move() // [1,1]
      .rotate(Rotation.LEFT)
      .move() // [1,2]
      .rotate(Rotation.RIGHT)
      .move() // [2,2]
      .rotate(Rotation.LEFT)
      .move() // [2,3]
      .rotate(Rotation.RIGHT)
      .move() // [3,3]
      .rotate(Rotation.LEFT)
      .move() // [3,4]
      .rotate(Rotation.RIGHT)
      .move() // [4,4]
      .report();

    // assert
    expect(robotState).toBe('4,4,EAST');
  });

  it('processes the remaining commands after skipping moves that would cause the robot to fall', () => {
    // assemble
    const robot = new Robot();

    // act
    const robotState = robot
      .place(simulator, { x: 0, y: 0, direction: Direction.NORTH })
      .move() // [0,1]
      .move() // [0,2]
      .move() // [0,3]
      .move() // [0,4]
      .move() // this move is skipped
      .rotate(Rotation.RIGHT)
      .move() // [1,4]
      .report();

    // assert
    expect(robotState).toBe('1,4,EAST');
  });

  it('ignores commands if the robot is not placed on the table', () => {
    // assemble
    const robot = new Robot();

    // act
    const robotState = robot
      .move()
      .rotate(Rotation.LEFT)
      .report();

    // assert
    expect(robotState).toBe('');
  });

  it('executes the commands', () => {
    // assemble
    const logSpy = vi.spyOn(console, 'log');
    const robot = new Robot();

    // act
    robot
      .execute('PLACE', '0,0,NORTH', simulator)
      .execute('MOVE')
      .execute('LEFT')
      .execute('RIGHT')
      .execute('REPORT');

    // assert
    expect(logSpy).toHaveBeenCalledWith('0,1,NORTH');
  });
});
