import React from 'react'
import { createPortal } from 'react-dom'
import { useModalStore } from '../store'
import { getW3Address, useConnect } from 'w3-evm-react'
import s from './index.module.scss'
const Modal = () => {

  const { open, setOpen } = useModalStore()
  const { wallets, connectW3 } = useConnect()

  const address = getW3Address()
  //close modal when connected
  if(address) return null

  const Modal = open && 
  <div id="conenct-modal" className={[s.container, open ? '' : s.containerClosed].join(' ')} onClick={()=>setOpen(false)}>
    <div className={s.card}  onClick={(e)=>e.stopPropagation()}>
      {wallets.map((wallet, i) =>(
        <>
        <div
        className={s.item}
        key={wallet.id}
        onClick={()=>connectW3(wallet)}>
          <img className={s.image} src={wallet.icon}/>
          {wallet.name}
          <span className={s.description} >Connect with {wallet.name}</span>
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