'use server'
import {db} from '@/firebase/admin'
import { cookies } from 'next/headers'
import {auth} from 'firebase-admin/auth'
import { id } from 'zod/v4/locales'
const ONE_WEEK = 60*60*24*7

export async function singUp(params:SignUpParams){
    const {uid,name,email,password}=params
    try{
        const userRecord = await db.collection('users').doc(uid).get()
        if(userRecord.exists){
            return{
                success:false,
                message:'user already exist'
            }
        }
        await db.collection('users').doc(uid).set({
            email,
            name
        })
        return {
            success:true,
            message:"Account Created Successfully,Please Sign-In"
        }

    }catch(e){
        console.error("Error by user", e)

        if(e==='auth/email-already-exists'){
            return {error:'User with this email already exists'
            }
        }
        return {error:'Something went wrong while creating user'}
    }
}

export async function signIn(params:SignInParams){

    const {email,idToken} = params
    try{
            const user = await auth.getUserByEmail(email)
            if(!user){
                return {
                    success:false,
                    message:"Not have an Account ,Create an account"
                }
            }
            await setSessionCookie(idToken)
    }catch(e){
        console.error("error :",e)
        return {
            success:false,
            message:"error while signing in"
        }
    }
}

export async function setSessionCookie(idToken:string){
    const cookieStore = await cookies()

    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK*1000
    })
    cookieStore.set('session',sessionCookie,{
        maxAge:ONE_WEEK,
        httpOnly:true,
        secure:process.env.NODE_ENV ==='production',
        path:'/',
        sameSite:'lax'
    })
}

export async function getCurrentUser():Promise<User | null>{
    const cookieStore = await cookies()

    const sessionCookie=cookieStore.get('session')?.value

    if(!sessionCookie) return null

    try{
        const decodedClaims= await auth.verifySessionCookie(sessionCookie,true)
        
        const userRecord= await db
        .collection('users')
        .doc(decodedClaims.uid)
        .get()
        
        if(!userRecord.exists) return null
        
        return {
            ...userRecord.data(),
            id:userRecord.id,
        } as User

    }catch(e){
        console.log(e)
        return null
    }
}
export async function isAuthenticated (){
    const user = await getCurrentUser()
    return !!user;
}