export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    primary: 'cyan',
    gray: 'slate',
    colors: {
      primary: 'cyan',
      secondary: 'slate', 
      neutral: 'slate',
      success: 'green',
      info: 'cyan',
      warning: 'yellow',
      error: 'red'
    },
    variables: {
      light: {
        background: '0 0% 100%',
        foreground: '222.2 84% 4.9%'
      },
      dark: {
        background: '222.2 84% 4.9%',
        foreground: '210 40% 98%'
      }
    }
  }
})
