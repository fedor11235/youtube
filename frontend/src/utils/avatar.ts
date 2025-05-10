import LogoImg from '../assets/logo.png'

export function getAvatar(fileName: string | undefined) {
  if(fileName) {
    return 'http://localhost:3000/api/files/avatar/' + fileName
  }
  return LogoImg
}

export function getBanner(fileName: string | undefined) {
  if(fileName) {
    return 'http://localhost:3000/api/files/banners/' + fileName
  }
  return LogoImg
}

export function getThumbnail(fileName: string | undefined) {
  if(fileName) {
    return 'http://localhost:3000/api/files/thumbnails/' + fileName
  }
  return 'https://cdn.quasar.dev/img/avatar.png'
}

export function getVideo(fileName: string | undefined) {
  if(fileName) {
    return 'http://localhost:3000/api/files/videos/' + fileName
  }
  return 'https://cdn.quasar.dev/img/avatar.png'
}

export function getPassport(fileName: string | undefined) {
  if(fileName) {
    return 'http://localhost:3000/api/files/passport/' + fileName
  }
  return LogoImg
}