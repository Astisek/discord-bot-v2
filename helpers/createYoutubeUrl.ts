import querystring from "querystring";

export const createYouTubeUrl = (url: string) => {
  return `${url}`
}
export const gitVideoId = (url: string): string => {
  const params = querystring.decode(url.split("?")[1])
  if (Array.isArray(params?.v)) {
    return ""
  }
  return params?.v || ""
}