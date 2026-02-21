// import {inngest} from "@/lib/inngest/client";
// import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
// import {sendNewsSummaryEmail, sendWelcomeEmail} from "@/lib/nodemailer";
// import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
// import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
// import { getNews } from "@/lib/actions/finnhub.actions";
// import { getFormattedTodayDate } from "@/lib/utils";

// type UserForNewsEmail = {
//   email: string;
//   name: string;
// };

// export const sendSignUpEmail = inngest.createFunction(
//     { id: 'sign-up-email' },
//     { event: 'app/user.created'},
//     async ({ event, step }) => {
//         const userProfile = `
//             - Country: ${event.data.country}
//             - Investment goals: ${event.data.investmentGoals}
//             - Risk tolerance: ${event.data.riskTolerance}
//             - Preferred industry: ${event.data.preferredIndustry}
//         `

//         const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

//         const response = await step.ai.infer('generate-welcome-intro', {
//             model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
//             body: {
//                 contents: [
//                     {
//                         role: 'user',
//                         parts: [
//                             { text: prompt }
//                         ]
//                     }]
//             }
//         })

//         await step.run('send-welcome-email', async () => {
//             const part = response.candidates?.[0]?.content?.parts?.[0];
//             const introText = (part && 'text' in part ? part.text : null) ||'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.'

//             const { data: { email, name } } = event;

//             return await sendWelcomeEmail({ email, name, intro: introText });
//         })

//         return {
//             success: true,
//             message: 'Welcome email sent successfully'
//         }
//     }
// )

// export const sendDailyNewsSummary = inngest.createFunction(
//     { id: 'daily-news-summary' },
//     [
//         { event: 'app/send.daily.news' },
//         { cron: '*/1 * * * *', timezone: 'Asia/Kathmandu' }
//     ],
//     async ({ step }) => {
//         // Step #1: Get all users for news delivery
//         const users = await step.run('get-all-users', getAllUsersForNewsEmail)

//         if(!users || users.length === 0) return { success: false, message: 'No users found for news email' };

//         // Step #2: For each user, get watchlist symbols -> fetch news (fallback to general)
//         const results = await step.run('fetch-user-news', async () => {
//             const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
//             for (const user of users as UserForNewsEmail[]) {
//                 try {
//                     const symbols = await getWatchlistSymbolsByEmail(user.email);
//                     let articles = await getNews(symbols);
//                     // Enforce max 6 articles per user
//                     articles = (articles || []).slice(0, 6);
//                     // If still empty, fallback to general
//                     if (!articles || articles.length === 0) {
//                         articles = await getNews();
//                         articles = (articles || []).slice(0, 6);
//                     }
//                     perUser.push({ user, articles });
//                 } catch (e) {
//                     console.error('daily-news: error preparing user news', user.email, e);
//                     perUser.push({ user, articles: [] });
//                 }
//             }
//             return perUser;
//         });

//         // Step #3: (placeholder) Summarize news via AI
//         const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

//         for (const { user, articles } of results) {
//                 try {
//                     const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

//                     const response = await step.ai.infer(`summarize-news-${user.email}`, {
//                         model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
//                         body: {
//                             contents: [{ role: 'user', parts: [{ text:prompt }]}]
//                         }
//                     });

//                     const part = response.candidates?.[0]?.content?.parts?.[0];
//                     const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

//                     userNewsSummaries.push({ user, newsContent });
//                 } catch (e) {
//                     console.error('Failed to summarize news for : ', user.email);
//                     userNewsSummaries.push({ user, newsContent: null });
//                 }
//             }

//         // Step #4: (placeholder) Send the emails
//         await step.run('send-news-emails', async () => {
//                 await Promise.all(
//                     userNewsSummaries.map(async ({ user, newsContent}) => {
//                         if(!newsContent) return false;

//                         return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent })
//                     })
//                 )
//             })

//         return { success: true, message: 'Daily news summary emails sent successfully' }
//     }
// )
import { inngest } from "@/lib/inngest/client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT
} from "@/lib/inngest/prompts";

import {
  sendNewsSummaryEmail,
  sendWelcomeEmail
} from "@/lib/nodemailer";

import { getAllUsersForNewsEmail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import { getFormattedTodayDate } from "@/lib/utils";



/* =========================================================
   TYPES
========================================================= */

type UserForNewsEmail = {
  email: string;
  name: string;
};



/* =========================================================
   SIGNUP WELCOME EMAIL FUNCTION
========================================================= */

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },

  async ({ event, step }) => {

    // ✅ Build profile string for AI prompt
    const userProfile = `
- Country: ${event.data.country}
- Investment goals: ${event.data.investmentGoals}
- Risk tolerance: ${event.data.riskTolerance}
- Preferred industry: ${event.data.preferredIndustry}
    `;

    const prompt =
      PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
        "{{userProfile}}",
        userProfile
      );

    // ✅ Generate welcome intro using AI
    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({
        model: "gemini-2.5-flash-lite"
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      }
    });

    // ✅ Extract generated text safely
    const part = response.candidates?.[0]?.content?.parts?.[0];
    const introText =
      (part && "text" in part ? part.text : null) ||
      "Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.";

    // ✅ Send welcome email
    await step.run("send-welcome-email", async () => {
      const { email, name } = event.data;
      return await sendWelcomeEmail({
        email,
        name,
        intro: introText
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully"
    };
  }
);



/* =========================================================
   DAILY NEWS SUMMARY FUNCTION
========================================================= */

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  [
    { event: "app/send.daily.news" },

    // ✅ SAFE CRON (once daily instead of every minute)
    { cron: "0 8 * * *", timezone: "Asia/Kathmandu" }
  ],

  async ({ step }) => {

    /* -----------------------------
       STEP 1 — GET USERS
    ----------------------------- */

    const users = await step.run(
      "get-all-users",
      getAllUsersForNewsEmail
    );

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "No users found for news email"
      };
    }

    // ✅ DEV LIMIT (remove in production)
    const safeUsers = (users as UserForNewsEmail[]).slice(0, 5);



    /* -----------------------------
       STEP 2 — FETCH NEWS PER USER
    ----------------------------- */

    const results = await step.run(
      "fetch-user-news",
      async () => {

        const perUser: Array<{
          user: UserForNewsEmail;
          articles: MarketNewsArticle[];
        }> = [];

        for (const user of safeUsers) {
          try {

            const symbols =
              await getWatchlistSymbolsByEmail(user.email);

            let articles = await getNews(symbols);
            articles = (articles || []).slice(0, 6);

            // fallback to general news
            if (!articles.length) {
              articles = await getNews();
              articles = (articles || []).slice(0, 6);
            }

            perUser.push({ user, articles });

          } catch (e) {

            console.error(
              "daily-news: error preparing user news",
              user.email,
              e
            );

            perUser.push({ user, articles: [] });
          }
        }

        return perUser;
      }
    );



    /* -----------------------------
       STEP 3 — AI SUMMARIZATION
    ----------------------------- */

    const userNewsSummaries: {
      user: UserForNewsEmail;
      newsContent: string | null;
    }[] = [];

    for (const { user, articles } of results) {

      // ✔ Skip AI if no articles
      if (!articles || articles.length === 0) {
        userNewsSummaries.push({
          user,
          newsContent: "No important market news today."
        });
        continue;
      }

      try {

        // ✅ IMPORTANT: delay prevents 429 errors
        await new Promise(r => setTimeout(r, 2500));

        const prompt =
          NEWS_SUMMARY_EMAIL_PROMPT.replace(
            "{{newsData}}",
            JSON.stringify(articles, null, 2)
          );

        const response = await step.ai.infer(
          `summarize-news-${user.email}`,
          {
            model: step.ai.models.gemini({
              model: "gemini-2.5-flash-lite"
            }),
            body: {
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }]
                }
              ]
            }
          }
        );

        const part = response.candidates?.[0]?.content?.parts?.[0];

        const newsContent =
          (part && "text" in part ? part.text : null) ||
          "Here is your market update for today.";

        userNewsSummaries.push({ user, newsContent });

      } catch (e) {

        console.error(
          "Failed to summarize news for:",
          user.email,
          e
        );

        // ✔ fallback summary if AI fails
        const fallback =
          articles
            .map(a => `• ${a.headline}`)
            .slice(0, 5)
            .join("\n") ||
          "Market updates unavailable today.";

        userNewsSummaries.push({
          user,
          newsContent: fallback
        });
      }
    }



    /* -----------------------------
       STEP 4 — SEND EMAILS
    ----------------------------- */

    await step.run(
      "send-news-emails",
      async () => {

        for (const { user, newsContent } of userNewsSummaries) {

          if (!newsContent) continue;

          try {
            await sendNewsSummaryEmail({
              email: user.email,
              date: getFormattedTodayDate(),
              newsContent
            });
          } catch (e) {
            console.error(
              "Email failed for:",
              user.email,
              e
            );
          }
        }
      }
    );



    return {
      success: true,
      message: "Daily news summary emails sent successfully"
    };
  }
);
