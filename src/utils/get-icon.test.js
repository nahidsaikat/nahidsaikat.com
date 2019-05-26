// @flow
import getIcon from './get-icon';
import { ICONS } from '../constants';

test('getIcon', () => {
  expect(getIcon('twitter')).toBe(ICONS.TWITTER);
  expect(getIcon('github')).toBe(ICONS.GITHUB);
  expect(getIcon('telegram')).toBe(ICONS.TELEGRAM);
  expect(getIcon('facebook')).toEqual(ICONS.FACEBOOK);
  expect(getIcon('email')).toEqual(ICONS.EMAIL);
  expect(getIcon('rss')).toEqual(ICONS.RSS);
});
