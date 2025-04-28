export function getAvatar(fileName: string | undefined) {
  if(fileName) {
    return 'http://localhost:3000/api/files/avatar/' + fileName
  }
  return 'https://cdn.quasar.dev/img/avatar.png'
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