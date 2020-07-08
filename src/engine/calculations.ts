import { calcDistanceType, calcAngleType } from './types';

export const normalizeAngle = (angle: number) => {
  angle = angle % (2 * Math.PI);
  if (angle < 0) {
    angle = 2 * Math.PI + angle;
  }

  return angle;
};

// Determine the distance between player and "ray hit" point
export const calcDistance = ({ object, target }: calcDistanceType) => {
  return Math.sqrt(
    (target.x - object.x) * (target.x - object.x) + (target.y - object.y) * (target.y - object.y)
  );
};

// Convert angle to radians
export const convertAngleToRadians = (angle: number) => {
  return angle * (Math.PI / 180);
};

// Calculate angle based on player position and angle
export const calcAngle = ({ cameraX, cameraY, cameraAngle, targetX, targetY }: calcAngleType) => {
  var vectX = targetX - cameraX;
  var vectY = targetY - cameraY;

  var anglePlayerObject = Math.atan2(vectY, vectX);
  var angleDifference = cameraAngle - anglePlayerObject;

  if (angleDifference < -Math.PI) angleDifference += 2.0 * Math.PI;

  if (angleDifference > Math.PI) angleDifference -= 2.0 * Math.PI;

  return Math.abs(angleDifference);
};

// Calculate distance between two points
export const calcDistanceBetweenPoints = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

// Check if a number is multiple of anotar
export const numIsMultipleOf = (M: number, N: number) => {
  // Formula => M = N * K
  // Se K for um número inteiro, então é múltiplo
  const K = M / N;
  return Number.isInteger(K);
};
