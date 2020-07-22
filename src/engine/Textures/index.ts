import rawTextures from '../../config/textures';
import { TextureType } from './types';

function Textures() {
  let textures: Array<TextureType> = [];

  // Preload textures
  const preload = () => {
    Object.keys(rawTextures).forEach((key) => {
      const img = new Image();
      img.src = rawTextures[key].image;

      textures.push({
        id: key,
        image: img,
        isWall: rawTextures[key].isWall,
        isObject: rawTextures[key].isObject,
        isCollidable: rawTextures[key].isCollidable,
        isLight: rawTextures[key].isLight,
      });
    });
  };
  preload();

  const get = (id: string) => {
    const r = textures.find((o) => o.id === id);
    return r;
  };

  return { get };
}

export default Textures;
