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
    const objectCenterX = object.x + object.width / 2;
    const objectCenterY = object.y + object.height / 2;

    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;

    // stores the distance between the objects (must be rectangle)
    var catX = objectCenterX - targetCenterX;
    var catY = objectCenterY - targetCenterY;

    var sumHalfWidth = object.width / 2 + target.width / 2;
    var sumHalfHeight = object.height / 2 + target.height / 2;

    console.log(Math.abs(catX), sumHalfWidth, Math.abs(catY), sumHalfHeight);

    if (Math.abs(catX) < sumHalfWidth && Math.abs(catY) < sumHalfHeight) {
      console.log('colliding');
      return true;
    } else {
      console.log('not');
      return false;
    }
  };
  return { check };
};

export default Collision;
