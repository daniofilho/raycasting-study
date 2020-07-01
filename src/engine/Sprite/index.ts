import { PlayerType } from '../../components/Player/types';

import { calcAngle, convertAngleToRadians } from '../calculations';

function Sprite(camera: PlayerType, x: number, y: number) {
  const props = {
    x,
    y,
    visible: false,
    distance: 0,
    angle: 0,
  };

  const updateProps = () => {
    const cameraFOV = camera.get('fieldOfView');
    const halfFOV = convertAngleToRadians(cameraFOV / 2);

    // Update Sprite distance
    this.props.angle = calcAngle({
      cameraX: camera.get('x'),
      cameraY: camera.get('y'),
      cameraAngle: camera.get('angle'),
      targetX: props.x,
      targetY: props.y,
    });

    this.visible = this.props.angle < halfFOV ? true : false;
  };

  const render = () => {
    updateProps();
  };

  return { render };
}

export default Sprite;
