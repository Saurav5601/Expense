import React from 'react'
import Header from '../Components/Header'
import SignupSigninComponent from '../Components/signupsignin'

const signup = () => {
  return (
    <div>
        <Header/>
        <div className='wrapper'>
            <SignupSigninComponent />
        </div>
        </div>
  )
}

export default signup