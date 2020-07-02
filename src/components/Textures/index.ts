import rawTextures from './textures';
import { TextureType } from './types';

import Sprite from '../../engine/Sprite';

function Textures() {
  let textures: Array<TextureType> = [];

  // Preload textures
  const preload = () => {
    Object.keys(rawTextures).forEach((key, index) => {
      const img = new Image();
      img.src = rawTextures[key].image;

      let sprite = null;
      if (rawTextures[key].isObject) {
        sprite = Sprite(img);
      }

      textures.push({
        id: key,
        image: img,
        vertical: rawTextures[key].vertical,
        horizontal: rawTextures[key].horizontal,
        isWall: rawTextures[key].isWall,
        isObject: rawTextures[key].isObject,
        isCollidable: rawTextures[key].isCollidable,
        sprite,
      });
    });
  };
  preload();

  const get = (id: string) => {
    const r = textures.find((o) => o.id === id);

    // can be string on number
    return r;
  };

  return { get };
}

export default Textures;
