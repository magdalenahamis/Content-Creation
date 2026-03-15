import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();
export { fontFamily };

export const theme = {
  white:     '#FFFFFF',
  black:     '#111111',
  lightGray: '#E8E8E8',
  dim:       'rgba(255, 255, 255, 0.35)',
  dimDark:   'rgba(17, 17, 17, 0.35)',
  yellow:    '#FFD700',
  overlay:   'rgba(17, 17, 17, 0.55)',
};
