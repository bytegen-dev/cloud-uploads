import React from 'react'

const Menu = ({showMenu}) => {
  return (
    <>
        <menu className={`menu ${showMenu ? "show" : ""}`}>
          ...
        </menu>
    </>
  )
}

export default Menu