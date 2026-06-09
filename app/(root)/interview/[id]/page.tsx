import React from 'react'
import { getInterviewById } from '@/lib/action/general.action'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { getRandomInterviewCover } from '@/lib/utils'
import DisplayTechIcons from '@/components/DisplayTechIcons'
import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/action/auth.action'

const page = async ({ params }: RouteParams) => {
  const { id } = await params
  const interview = await getInterviewById(id)
  const user = await getCurrentUser()

  if (!interview) redirect('/')

  return (
    <>
      <div className='flex flex-row gap-4 justify-between'>
        <div className='flex flex-row  gap-4 items-center'>
          <div className='flex flex-row gap-4 items-center'>
            <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className='rounded-full object-fit size-[90px] object-cover' />
            <h1 className="capitalize text-4xl">{interview.role}</h1>
          </div>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>
        <p className='bg-dark-200 px-4 py-2 h-fit rounded-lg'>{interview.type}</p>
      </div>
      <Agent
        userName={user?.name}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />

    </>
  )
}

export default page
