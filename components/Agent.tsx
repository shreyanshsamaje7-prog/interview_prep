import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

enum status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    FINISHED = 'FINISHED'
}

const Agent = ({ userName }: AgentProps) => {
    const callStatus = status.ACTIVE
    const isSpeaking = true;
    const message =["What is your name?",
        "My name is king of hell ,nice to meet you",
    ]
    const lastMessage = message[message.length - 1]
    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src='/ai-avatar.png' alt="ai-avatar" width={62} height={50} />
                        {isSpeaking && <span className='animate-speak' />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src='/user-avatar.png' alt='userAvatar' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-center flex-col">

               {message.length >0 &&  <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={lastMessage} className={cn('transition-opacity opacity-0 duration-500  ','animatefadeIn opacity-100')} >{lastMessage}</p>
                    </div>
                </div>
}
                {callStatus !== 'ACTIVE' ? (
                    <Button className='relative btn-call'>
                        <span
                            className={cn(
                                'absolute animate-ping rounded-full opacity-75',
                                callStatus !== 'CONNECTING' & 'hidden'
                            )}
                        />

                        <span> {callStatus === 'INACTIVE' ||
                            callStatus === status.FINISHED
                            ? 'Call'
                            : '...'}  </span>
                    </Button>
                ) : (
                    <Button className='btn-disconnect'>
                        End
                    </Button>
                )}
            </div>
        </>
    )
}

export default Agent
