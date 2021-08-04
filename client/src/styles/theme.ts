import { createTheme } from '@material-ui/core';
import Color from 'color';
import { logger } from '../common-util';

const primary = '#6A7B76';
const secondary = '#8B9D83';
const info = Color('#BEB0A7').lighten(0.1).hex().toString();
const success = '#3A4E48';
const text = {
    primary: '#040303',
    secondary: '#3A4E48',
    disabled: '#BEB0A7',
};

const colorArray = [{ primary }, { secondary }, { info }, { success }];

const buildColorObject = (color: string) => {
    try {
        const colorObject: any = {};

        colorObject.main = color;
        colorObject.light = Color(color).lighten(0.3).hex().toString();
        colorObject.dark = Color(color).darken(0.3).hex().toString();

        return colorObject;
    } catch (err) {
        logger('error in buildColorObject', err);
        return null;
    }
};

const buildTheme = () => {
    try {
        const themeObj = colorArray.reduce((acc, curr) => {
            const key: any = Object.keys(curr).pop();
            const value: string = Object.values(curr).pop();
            if (!acc[key]) {
                acc = {
                    ...acc,
                    [key]: {
                        ...buildColorObject(value),
                    },
                };
            }

            return acc;
        }, {});
        return { ...themeObj, text };
    } catch (err) {
        logger('error thrown in getTheme', err);
        return null;
    }
};

const builtThemeObject = buildTheme();

export const theme = createTheme({ palette: { ...builtThemeObject } });

// export const theme = createTheme({
//   palette: {
//     primary: {
//       main: primary,
//     },
//     secondary: {
//       main: secondary,
//     },
//     info: {
//       main: info,
//     },
//     success: {
//       main: success,
//     },
//     text,
//   },
// });
