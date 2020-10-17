export default function (this: any, seconds: number) {
  if (!seconds) return this
  this.header('cache-control', `max-age=${seconds}`)
  return this
}