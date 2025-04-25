export function getAvatar(fileName: string | undefined) {
  if(fileName) {
    return 'http://localhost:3000/api/files/upload/' + fileName
  }
  return 'https://cdn.quasar.dev/img/avatar.png'
}