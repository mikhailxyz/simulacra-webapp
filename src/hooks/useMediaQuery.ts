import { useState, useEffect } from "react"

const isAPISupported = (api: string): boolean => (typeof window !== "undefined" ? api in window : false)

const errorMessage =
  "matchMedia is not supported, this could happen both because window.matchMedia is not supported by" +
  " your current browser or you're using the useMediaQuery hook whilst server side rendering."

/**
 * Accepts a media query string then uses the
 * [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API to determine if it
 * matches with the current document.<br />
 * It also monitor the document changes to detect when it matches or stops matching the media query.<br />
 * Returns the validity state of the given media query.
 *
 */
const useMediaQuery = (mediaQuery: string): boolean => {
  const [isVerified, setIsVerified] = useState(!!window.matchMedia(mediaQuery).matches)

  useEffect(() => {
    if (!(typeof window !== "undefined") || !isAPISupported("matchMedia")) {
      // eslint-disable-next-line no-console
      console.warn(errorMessage)
      return
    }

    const mediaQueryList = window.matchMedia(mediaQuery)
    const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches)

    mediaQueryList.addListener(documentChangeHandler)

    documentChangeHandler()
    return () => {
      mediaQueryList.removeListener(documentChangeHandler)
    }
  }, [mediaQuery])

  return isVerified
}

export { useMediaQuery }
