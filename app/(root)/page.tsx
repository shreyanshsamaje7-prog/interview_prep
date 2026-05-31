import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'


const page = () => {
  return (
    <>
    <section className= 'flex flex-row items-center min-w-lg card-cta'>
      <div className='flex flex-col gap-6 text-white'>
          <h2>Get Interview Ready with AI Powered Practice & Learning</h2>
          <p>practice on real interview questions & get feedback</p>
          <Button className='btn-primary w-2/3'>Start an Interview</Button>
      </div>
      <Image src='/robot.png' alt='robot' width={400} height={400}/>
    </section>
    <section className='flex flex-col gap-6 mt-8'>

      <h2>Your Intervies</h2>
      <div className='interviews-section'>

      {dummyInterviews.map((interview)=>{
        return (
          <InterviewCard
          {...interview}
          key={interview.id}
          />
        )
      })}
      </div>
    </section>
    <section className='flex flex-col gap-6 mt-8'>
      <h2>Take an Interview</h2>
      <div className='interviews-section'>

      {dummyInterviews.map((interview)=>{
        return (
          <InterviewCard
          {...interview}
          key={interview.id}
          />
        )
      })}
      </div>
    </section>
    </>
  )
}

export default page
