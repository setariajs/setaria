export const inBrowser = typeof window !== 'undefined'

export const isFirefox = () => {
  const agent = window.navigator.userAgent.toLowerCase()
  return (typeof window !== 'undefined' && agent) &&
    /firefox\/\d+/.test(agent)
}
