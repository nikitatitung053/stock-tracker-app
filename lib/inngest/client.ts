import { apiKey } from "better-auth/plugins";
import { Inngest } from "inngest";

export const inngest=new Inngest({
    id:'Tradexx',
    eventKey:process.env.INNGEST_EVENT_KEY,
    ai:{gemini: {apiKey:process.env.GEMINI_API_KEY!}}
})