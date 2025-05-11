import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from "react-native-paper"
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

export const LightThemeColors = {
    "primary2": "rgb(6, 110, 0)",
    "primary": "rgb(0, 118, 186)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(153, 249, 130)",
    "onPrimaryContainer": "rgb(1, 34, 0)",
    "secondary": "rgb(84, 99, 77)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(215, 232, 205)",
    "onSecondaryContainer": "rgb(18, 31, 14)",
    "tertiary": "rgb(56, 101, 104)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(188, 235, 238)",
    "onTertiaryContainer": "rgb(0, 32, 33)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(243, 245, 248)",
    "background2": "rgb(243, 245, 248)",
    "onBackground": "rgb(26, 28, 24)",
    "surface": "rgb(255, 255, 255)",
    "onSurface": "rgb(26, 28, 24)",
    "surfaceVariant": "rgb(223, 228, 215)",
    "onSurfaceVariant": "rgb(67, 72, 63)",
    "outline": "rgb(115, 121, 110)",
    "outlineVariant": "rgb(195, 200, 188)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(47, 49, 45)",
    "inverseOnSurface": "rgb(241, 241, 235)",
    "inversePrimary": "rgb(126, 220, 105)",
    "elevation": {
        "level0": "transparent",
        "level1": "rgb(240, 246, 234)",
        "level2": "rgb(232, 242, 226)",
        "level3": "rgb(225, 237, 219)",
        "level4": "rgb(223, 236, 217)",
        "level5": "rgb(218, 233, 212)"
    },
    "surfaceDisabled": "rgba(26, 28, 24, 0.12)",
    "onSurfaceDisabled": "rgba(26, 28, 24, 0.38)",
    "backdrop": "rgba(44, 50, 41, 0.4)"
}

export const DarkThemeColors = {
    "primary": "rgb(4, 167, 255)",
    "primary2": "rgb(0, 51, 204)",
    "onPrimary": "rgb(2, 58, 0)",
    "primaryContainer": "rgb(3, 83, 0)",
    "onPrimaryContainer": "rgb(119, 255, 95)",
    "secondary": "rgb(156, 215, 105)",
    "onSecondary": "rgb(26, 55, 0)",
    "secondaryContainer": "rgb(40, 80, 0)",
    "onSecondaryContainer": "rgb(183, 244, 129)",
    "tertiary": "rgb(200, 206, 68)",
    "onTertiary": "rgb(49, 51, 0)",
    "tertiaryContainer": "rgb(71, 74, 0)",
    "onTertiaryContainer": "rgb(229, 234, 93)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(35, 42, 51)",
    "background2": "rgb(35, 42, 51)",
    "onBackground": "rgb(226, 227, 220)",
    "surface": "rgb(35, 42, 51)",
    "onSurface": "rgb(226, 227, 220)",
    "surfaceVariant": "rgb(67, 72, 63)",
    "onSurfaceVariant": "rgb(195, 200, 188)",
    "outline": "rgb(141, 147, 135)",
    "outlineVariant": "rgb(67, 72, 63)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(226, 227, 220)",
    "inverseOnSurface": "rgb(47, 49, 45)",
    "inversePrimary": "rgb(5, 110, 0)",
    "elevation": {
        "level0": "transparent",
        "level1": "rgb(29, 38, 26)",
        "level2": "rgb(31, 44, 27)",
        "level3": "rgb(33, 50, 29)",
        "level4": "rgb(33, 52, 29)",
        "level5": "rgb(34, 56, 30)"
    },
    "surfaceDisabled": "rgba(226, 227, 220, 0.12)",
    "onSurfaceDisabled": "rgba(226, 227, 220, 0.38)",
    "backdrop": "rgba(0, 0, 0, 0.6)"
}

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme
});

export const LightThemeFinal = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...LightTheme.colors,
        ...LightThemeColors
    },
    fonts: MD3LightTheme.fonts
}

export const DarkThemeFinal = {
    ...MD3DarkTheme,
    ...NavigationDarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        ...DarkTheme.colors,
        ...DarkThemeColors
    },
    fonts: MD3LightTheme.fonts
}

export const ToastLightTheme = {
    label: "rgb(0,0,0)",
    card: "rgb(216,216,220)",
    danger: "rgb(255,59,48)",
    overlay: "#000000",
    success: "rgb(52,199,85)",
    warning: "rgb(255,149,0)",
    info: "rgb(0,122,255)"
};

export const ToastDarkTheme = {
    label: "rgb(255,255,255)",
    card: "rgb(54,54,56)",
    danger: "rgb(255,69,58)",
    overlay: "#000000",
    success: "rgb(48,209,88)",
    warning: "rgb(255,159,10)",
    info: "rgb(10,132,255)"
};