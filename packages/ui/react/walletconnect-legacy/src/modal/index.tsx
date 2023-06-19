import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useModalStore } from '../store/store'
import { getW3Address, useConnect } from 'w3-evm-react'
const Modal = () => {

  const { open, setOpen } = useModalStore()
  const { wallets, connectW3 } = useConnect()

  const [hover, setHover] = useState<number | null>()

  const address = getW3Address()
  //close modal when connected
  if(address) setOpen(false)

  const Modal = open && 
  <div id="conenct-modal" style={open ? container : containerClosed} onClick={()=>setOpen(false)}>
    <div style={card}  onClick={(e)=>e.stopPropagation()}>
      {wallets.map((wallet, i) =>(
        <>
        <div 
        onMouseEnter={()=>setHover(i)}
        onMouseLeave={()=>setHover(null)}
        style={ hover === i ? {...item, ...itemHover} : item}
        key={wallet.id}
        onClick={()=>connectW3(wallet)}>
          <img style={image} src={wallet.icon}/>
          {wallet.name}
          <span style={description} >Connect with {wallet.name}</span>
        </div>
        {wallets.length !== i+1 && <hr style={{ height:'2px', background:'rgba(0,0,0,0.1)', width:'100%', border:'none' }} />}  
        </>

      ))}
    </div>
  </div>

  if(typeof window === 'undefined') return null

  return createPortal(Modal, document.body)
}

export default Modal

/*<---STYLES--->*/
const container:React.CSSProperties = {
  margin: '0',
  padding: '15px',
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  width: '100%',
  height: '100vh',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  backgroundColor: 'rgba(0, 0, 0, 0.6)'
}

const containerClosed:React.CSSProperties = {
  display:'none'
}

const card: React.CSSProperties = {
  background: '#fff',
  width: '100%',
  margin:'10px',
  maxWidth: '500px',
  minWidth:'fit-content',
  // display:'grid',
  // gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  maxHeight: '100%',
  borderRadius: '12px',

  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection:'column',

  position: 'absolute',
  fontSize: '29px',
  
  border: '1px solid rgba(195, 195, 195, 0.14)'
}

const item:React.CSSProperties = {
  height:'130px',
  width: '100%',
  margin: '8px',
  display: 'flex',
  justifyContent: 'center',
  boxAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap:'10px',
  cursor: 'pointer',
  borderRadius: '12px',
  color: '#000',
  fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  fontWeight:'700',
  fontSize:'24px',
}

const image:React.CSSProperties = {
  width:'45px',
  height:'45px'
}

const itemHover:React.CSSProperties = {
  backgroundColor:'rgba(195, 195, 195, 0.14)'
}

const description:React.CSSProperties = {
  // opacity:'0.4',
  color:'rgb(169, 169, 188)',
  fontSize:'18px',
  fontWeight:'400'
}