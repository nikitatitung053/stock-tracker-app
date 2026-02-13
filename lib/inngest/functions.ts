
import { sendWelcomeEmail } from "../nodemailer"
import { inngest } from "./client"
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts"

export const sendSignUpEmail=inngest.createFunction(
    {id:'sign-up-email'},
    {event:'app/user.created'},
    async({event,step})=>{
        console.log('📧 sendSignUpEmail started with event:', event.data);
        
        const userProfile=`
        - Country:${event.data.country}
        - Investment goals:${event.data.investmentGoals}
        - Risk tolerance:${event.data.riskTolerance}
        - Preferred industry:${event.data.preferredIndustry}
        `
 const prompt=PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}',userProfile)
 
 console.log('🤖 Calling Gemini AI...');
const response=await step.ai.infer('generate-welcome-intro',{
    model:step.ai.models.gemini({model:'gemini-2.5-flash-lite'}),
        body:{
            contents:[
                {
                    role:'user',
                    parts:[
                        {text:prompt}
                    ]
                }
            ]
        }
    
})

console.log('✅ AI response received:', response);

await step.run("send-welcome-email",async()=>{
    const part=response.candidates?.[0]?.content?.parts?.[0];
    const introText=(part && 'text' in part ? part.text : null)||"Thanks for joining Tradex. You now have the tools to track markets and make smarter moves. "

    const {data:{email,name}}=event;
    console.log('📤 Sending email to:', email, 'name:', name);
    const result = await sendWelcomeEmail({email,name,intro:introText});
    console.log('✉️ Email sent successfully!');
    return result;
})

return {
    success:true,
    message:'Welcome email sent succesfully'
}
}
    

    
)