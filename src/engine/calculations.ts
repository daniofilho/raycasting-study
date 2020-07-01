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

  return {
    angle: Math.abs(angleDifference),
  };
};
