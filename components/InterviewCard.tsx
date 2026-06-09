import React from 'react'
import dayjs from 'dayjs'
import { getRandomInterviewCover } from '@/lib/utils'

import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import DisplayTechIcons from './DisplayTechIcons'

const InterviewCard = ({ id, userId, role,type,techstack,createdAt }: InterviewCardProps) => {

    const feedback = null as Feedback | null
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type
    const fomrmatedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D,YYYY")
    return (
        <div className='card-border w-[360px]  min-h-96'>
            <div className='card-interview'>
                <div >
                    <div className='absolute top-0 right-0 rounded-lg px-4 py-2 w-fit bg-light-600'>
                        <p className='badge-text'>{normalizedType}</p>
                    </div>
                    <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className='rounded-full object-fit size-[90px]' />
                    <div className='flex flex-row gap-6 mt-5'>
                        <div className='flex flex-row gap-2 '>
                            <Image src='/calendar.svg' alt='calendar' width={22} height={22} />
                            <p>{fomrmatedDate}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <Image src='/star.svg' alt='calendar' width={22} height={22} />
                            <p>{feedback?.totalScore || '---'}/100</p>

                        </div>

                    </div>


                    <p className='line-clamp-2 mt-5'>{feedback?.finalAssessment || "not taken interview yet ,take interview for your progress"}</p>

                </div>
                <div className='flex flex-row justify-between'>
                    <DisplayTechIcons techStack={techstack} />
                    <Button className='btn-primary'>
                        <Link href={feedback ?
                            `/interviews/${id}/feedback`
                            : `/interview/${id}`
                        }>
                            {feedback ? "View Feedback" : "Take Interview"}
                        </Link>
                    </Button>
                </div>

            </div>

        </div>
    )
}

export default InterviewCard
