import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}',
      color: '{green.700}',
      contrastColor: '#ffffff',
      hoverColor: '{green.800}',
      activeColor: '{green.900}',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{green.600}',
      offset: '2px',
    },
    surface: {
      0: '#ffffff',
      50: '{gray.50}',
      100: '{gray.100}',
      200: '{gray.200}',
      300: '{gray.300}',
      400: '{gray.400}',
      500: '{gray.500}',
      600: '{gray.600}',
      700: '{gray.700}',
      800: '{gray.800}',
      900: '{gray.900}',
      950: '{gray.950}',
    },
    highlight: {
      background: '{green.50}',
      focusBackground: '{green.100}',
      color: '{green.800}',
      focusColor: '{green.900}',
    },
    formField: {
      borderRadius: '{border.radius.lg}',
      focusBorderColor: '{green.500}',
      hoverBorderColor: '{green.300}',
    },
    content: {
      borderRadius: '{border.radius.lg}',
    },
  },
  components: {
    button: {
      root: {
        borderRadius: '{border.radius.lg}',
        paddingY: '0.5rem',
        paddingX: '0.9rem',
        label: { fontWeight: '600' },
      },
    },
    card: {
      root: {
        borderRadius: '{border.radius.xl}',
        shadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
      },
    },
    toast: {
      root: { borderRadius: '{border.radius.lg}' },
    },
    progressspinner: {
      root: {
        colorOne: '{primary.500}',
        colorTwo: '{primary.400}',
        colorThree: '{primary.600}',
        colorFour: '{primary.500}',
      },
    },
  },
});
