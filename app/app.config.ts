export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'gray',
    },
    // Global theme configuration
    variables: {
      light: {
        background: '255 255 255',
        foreground: '2 8 23'
      },
      dark: {
        background: '2 8 23',
        foreground: '255 255 255'
      }
    },
    button: {
      defaultVariants: {
        color: 'primary'
      }
    }
  }
})
