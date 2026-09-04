import { scale } from './colors';

export const FontSize = {
  xs:    scale(10),
  sm:    scale(12),
  base:  scale(14),
  md:    scale(15),
  lg:    scale(16),
  xl:    scale(18),
  xxl:   scale(20),
  xxxl:  scale(24),
  title: scale(28),
  hero:  scale(32),
};

export const FontWeight = {
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
};

export const LineHeight = {
  tight:   1.2,
  normal:  1.5,
  relaxed: 1.75,
};
