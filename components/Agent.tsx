'use client'
import React, { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {vapi} from "@/lib/vapi.sdk"
import { error } from 'console';
import { useRouter } from 'next/navigation';
import { interviewer } from '@/constants';

enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    FINISHED = 'FINISHED',
}

interface SavedMessage {
    role:"assistant" | "system" | "user"
    content: string
}

const Agent = ({ userName ,userId,type,interviewId,questions}: AgentProps) => {
    const router = useRouter()
    const [callStatus, setcallStatus] = useState(Status.INACTIVE)
    const [message, setMessage] = useState<SavedMessage[]>([])
    const [isSpeaking, setisSpeaking] = useState(false)
    
    const lastMessage = message[message.length - 1]

    const handleGenerateFeedback= async(message:SavedMessage[])=>{
        console.log("Generate Feedback here")

        const {sucess,id}={
            sucess:true,
            id:'feedback-id'
        }

        if(sucess && id){
            router.push(`/interview/${interviewId}/feedback`)
        }
        else{
            console.log("Error while generating the feedback")
            router.push(`/`)
        }
    }
    
    useEffect(()=>{
        const onCallStart=()=>{setcallStatus(Status.ACTIVE)}
        const onCallEnd=()=>{setcallStatus(Status.FINISHED)}

        const onMessage=(message:Message)=>{
            if(message.type === 'transcript' && message.transcriptType==='final'){
                const newMessage={role:message.role,content:message.transcript}

                setMessage((prev) => [...prev,newMessage])
            }
        }

        const onSpeachStart=()=>setisSpeaking(true)
        const onSpeachEnd =()=> setisSpeaking(false)
        const onError =(error:Error)=> console.log("error",error)

        vapi.on('call-start',onCallStart)
        vapi.on('call-end',onCallEnd)
        vapi.on('message',onMessage)
        vapi.on('speech-start',onSpeachStart)
        vapi.on('speech-end',onSpeachEnd)
        vapi.on('error',onError)

        return ()=>{
        vapi.off('call-start',onCallStart)
        vapi.off('call-end',onCallEnd)
        vapi.off('message',onMessage)
        vapi.off('speech-start',onSpeachStart)
        vapi.off('speech-end',onSpeachEnd)
        vapi.off('error',onError)
        }
    },[])

    useEffect(()=>{
        if(callStatus === Status.FINISHED){
            if(type === 'generate'){
                router.push('/')
            }
            else{
                handleGenerateFeedback(message)
            }
        }
    },[message,userId,type,callStatus])

    const handleCall = async ()=>{

        if(type === 'generate'){

            setcallStatus(Status.CONNECTING)
            console.log(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID)
             vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
                 variableValues:{
                     userid : userId,
                     username : userName,
                 }
             })
        }
        else{
            let formatedQuestions=''
            if(questions){
                formatedQuestions=questions.map((question)=>{`- ${question}`}).join('\n')
            }
            await vapi.start(interviewer,{
                variableValues:{
                    questions:formatedQuestions
                }
            }

            )
        }
    }

    const handleDisconnect =()=>{
        setcallStatus(Status.FINISHED)
        vapi.stop()
    }
    
    const isCallInactiveOrFinished= callStatus === Status.INACTIVE || callStatus === Status.FINISHED

    const latestMessage = message[message.length - 1]?.content
    
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
            <div className="flex flex-col w-full justify-center items-center gap-4">

               {message.length >0 &&  <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={latestMessage} className={cn('transition-opacity opacity-0 duration-500  ','animatefadeIn opacity-100')} >{latestMessage}</p>
                    </div>
                </div>
}
                {callStatus !== 'ACTIVE' ? (
                    <Button className='relative btn-call w-0.1 p-2 bg-success-100' onClick={handleCall}>
                        <span
                            className={cn(
                                'absolute animate-ping rounded-full opacity-75',
                                callStatus !== Status.CONNECTING && 'hidden'
                            )}
                        />

                        <span> {callStatus === Status.INACTIVE ||
                            callStatus === Status.FINISHED
                            ? 'Call'
                            : '...'}  </span>
                    </Button>
                ) : (
                    <Button className='btn-disconnect w-0.1 p-2 bg-red-500' onClick={handleDisconnect}>
                        End
                    </Button>
                )}
            </div>
        </>
    )
}

export default Agent
