// Class that detects collision between player and other objects
const Collision = () => {
  interface checkType {
    object: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    target: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }

  const check = ({ object, target }: checkType) => {
    // stores the distance between the objects (must be rectangle)
    var catX = object.x + object.width / 2 - target.x / 2;
    var catY = object.y + object.height / 2 - target.y / 2;

    var sumHalfWidth = object.width / 2 + target.width / 2;
    var sumHalfHeight = object.height / 2 + target.height / 2;

    if (Math.abs(catX) < sumHalfWidth && Math.abs(catY) < sumHalfHeight) {
      return true;
    } else {
      return false;
    }
  };
  return { check };
};

export default Collision;
