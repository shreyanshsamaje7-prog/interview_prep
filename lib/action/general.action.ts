import {db,auth} from "@/firebase/admin"

export async function getInterviewsByUserId(userId:string):Promise<Interview[]|null>{

    if (!userId) {
        console.log("userId is undefined");
        return [];
    }
    const interviews= await db.
    collection("interviews")
    .where("userId","==",userId)
    .orderBy("createdAt", "desc")
    .get();


    return interviews.docs.map((doc)=>({
        id : doc.id,
        ...doc.data()
    })) as Interview[];
} 
export async function getLatestInterviews(params: GetLatestInterviewsParams):Promise<Interview[]|null>{
    const {userId,limit=20}=params;



    if (!userId) {
        console.log("userId is undefined");
        return [];
    }
    const interviews= await db.
    collection("interviews")
    .orderBy("createdAt", "desc")
    .where('finalized', '==', true)
    .where("userId","!=",userId)
    .limit(limit)
    .get();


    return interviews.docs.map((doc)=>({
        id : doc.id,
        ...doc.data()
    })) as Interview[];
} 

export async function getInterviewById(params:RouteParams):Promise<Interview|null>{
    const id = await params?.id
    const interview= await db.
    collection("interviews")
    .doc(id)
    .get();


    return interview.exists ? {
        id: interview.id,
        ...interview.data()
    } as Interview : null;
} 