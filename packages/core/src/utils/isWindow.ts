export const isWindow = ()=>{
  if(typeof window !== 'undefined'){
    return window.location.href
  }
  return ''
}