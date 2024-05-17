import { beforeEach, describe, expect, it } from 'vitest';
import { Simulation } from './simulation';

describe('Simulation', () => {
  let simulator: Simulation;

  beforeEach(() => {
    simulator = new Simulation();
  });

  it('returns the dimensions of the table', () => {
    // act
    const dimensions = simulator.getDimensions();

    // assert
    expect(dimensions).toEqual([5, 5]);
  });

  it('returns true when robot is within the dimensions', () => {
    // act
    const isValid = simulator.isPositionValid([0, 0]);
    const isAlsoValid = simulator.isPositionValid([0, 4]);

    // assert
    expect(isValid).toBeTruthy();
    expect(isAlsoValid).toBeTruthy();
  });

  it('returns false when robot is outside the dimensions', () => {
    // act
    const isValid = simulator.isPositionValid([5, 5]);
    const isAlsoValid = simulator.isPositionValid([-1, -1]);

    // assert
    expect(isValid).toBeFalsy();
    expect(isAlsoValid).toBeFalsy();
  });

  it('throws an error when the position is invalid', () => {
    // act
    const invalidPos = () => simulator.isPositionValid([0, 0, 0]);

    // assert
    expect(invalidPos).toThrowError('Invalid position');
  });
});
