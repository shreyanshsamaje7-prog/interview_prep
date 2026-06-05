import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/action/auth.action'
import React from 'react'


const page = async () => {
  const user = await getCurrentUser()

  return (
    <div className='flex flex-col gap-5'>
      <h3>Interview Generation</h3>
      <Agent userName={user?.name} userId={user?.id} type='generate' />
    </div>
  )
}

export default page
