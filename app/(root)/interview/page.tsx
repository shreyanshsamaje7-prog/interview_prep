import Agent from '@/components/Agent'
import React from 'react'


const page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <h3>Interview Generation</h3>
      <Agent userName="yours" userId='user1' type='generate' />
    </div>
  )
}

export default page
