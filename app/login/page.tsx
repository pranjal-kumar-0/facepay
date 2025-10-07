import LoginButton from '@/components/Login'
import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
        <LoginButton />
      </div>
    </div>
  )
}

export default Page
