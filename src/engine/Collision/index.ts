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
    //https://developer.mozilla.org/pt-BR/docs/Games/Techniques/2D_collision_detection
    if (
      object.x < target.x + target.width &&
      object.x + object.width > target.x &&
      object.y < target.y + target.height &&
      object.y + object.height > target.y
    ) {
      // collision detected!
      return true;
    }
    return false;
  };
  return { check };
};

export default Collision;
