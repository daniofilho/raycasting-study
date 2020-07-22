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

    //if (!r) return textures[0];

    return r;
  };

  return { get };
}

export default Textures;
