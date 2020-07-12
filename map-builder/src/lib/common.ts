import { textures, textureType } from 'textures';

const getTexture = (tex: string) => {
  let r = textures[0];
  textures.map((t: textureType) => {
    if (tex === t.id) r = t;
    return true;
  });
  // default
  return r;
};

export { getTexture };
