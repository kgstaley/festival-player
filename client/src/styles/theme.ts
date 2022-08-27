import { createTheme } from '@material-ui/core';
import Color from 'color';
import { logger } from '../common-util';

const primary = '#134074';
const secondary = '#8da9c4';
const info = Color('#eef4ed').lighten(0.1).hex().toString();
const success = '#0b2545';
const tertiary = '#13315c';
const text = {
    primary,
    secondary,
    tertiary,
    disabled: info,
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
