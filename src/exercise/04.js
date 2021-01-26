// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

// const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))
function callAll(...fns) {
  return (...args) => {
    fns.forEach(fn => {
      fn && fn(...args)
    })
  }
}

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props
    }
  }

  return {on, toggle, getTogglerProps}
}

// original version
// function App() {
//   const {on, togglerProps} = useToggle()
//   return (
//     <div>
//       <Switch on={on} {...togglerProps} />
//       <hr />
//       <button aria-label="custom-button" {...togglerProps}>
//         {on ? 'on' : 'off'}
//       </button>
//     </div>
//   )
// }

// Extra Credit 1 First Demonstration Version
/*
  The problem: the onClick function works, but it overrides the onClick function passed in via togglerProps. Our goal
  is that we should have both functions work. We can't do that using the original version of our API. We need to do
  something, probably with function composition to get that to work.
*/
// function App() {
//   const {on, togglerProps} = useToggle()
//   return (
//     <div>
//       <Switch on={on} {...togglerProps} />
//       <hr />
//       <button
//         aria-label="custom-button"
//         {...togglerProps}
//         onClick={() => console.info('onButtonClick')}
//       >
//         {on ? 'on' : 'off'}
//       </button>
//     </div>
//   )
// }

// alternative solution, which does work in a way
/*
onClick = {() => {
  console.info('onButtonClick')
  togglerProps.onClick()  
}}
*/
// But KCD notes in video that this is dependent on maintain the onClick property name, which could be rightly regarded
// as an implementation detail that isn't in the scope of concern for the user trying to add the console/whatever
// So instead of sourcing this detail to the caller of the function, we specify in the custom hook which props are
// defaulted, and how we want to be able to override those default values. On reflection, I do see how this makes
// more sense than the alternative solution and get why he might describe this as an implementation detail. But
// yeah, this is the Advanced-React-Patterns solution for a reason, and I'm not really there.

// Extra Credit 1 Second Version
function App() {
  const {on, getTogglerProps} = useToggle()
  return (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button
        {...getTogglerProps({
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
          id: 'custom-button-id',
        })}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
