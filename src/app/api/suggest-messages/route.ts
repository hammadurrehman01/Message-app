// import { NextResponse } from 'next/server';
// // import GeminiClient from 'gemini-sdk'; // Import the actual Gemini SDK you're using
// import {GenerativeModel } from '@google/generative-ai'; // Import the actual Gemini SDK you're using

// const client = new GeminiClient({
//   apiKey: process.env.GEMINI_API_KEY, // Ensure your API key is set
// });

// export async function POST(req: Request) {
//   try {
//     const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const response = await client.chat.completions.create({
//       model: 'tts-1-1106',
//       messages: [{ role: 'user', content: prompt }],
//       stream: true,
//     });

//     // Handle the streaming response here
//     let suggestions = '';
//     for await (const chunk of response) {
//       suggestions += chunk;
//     }

//     console.log("Suggested Messages:", suggestions);

//     return NextResponse.json(
//       { suggestions, success: true },
//       { status: 200 }
//     );

//   } catch (error: any) {
//     if (error.response && error.response.status === 401) {
//       return NextResponse.json(
//         { message: 'Invalid API Key', success: false },
//         { status: 401 }
//       );
//     }
//     console.error('An unexpected error occurred:', error);
//     return NextResponse.json(
//       { message: 'Internal server error', success: false },
//       { status: 500 }
//     );
//   }
// }








import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const configuration = new GoogleGenerativeAI(process.env.API_KEY as any);

    const modelId = "gemini-pro";

    const model = configuration.getGenerativeModel({ model: modelId });

    const conversationContext = [] as any[];
    const currentMessages = [];

    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."


    for (const [inputText, responseText] of conversationContext) {
      currentMessages.push({ role: "user", parts: inputText });
      currentMessages.push({ role: "model", parts: responseText });
    }


    const chat = model.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });


    const result = await chat.sendMessage(prompt);

    const response = await result.response;
    const responseText = response.text();

    conversationContext.push([prompt, responseText]);

    return NextResponse.json(
      { responseText, success: true },
      { status: 200 }
    );

  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return NextResponse.json(
        { message: 'Invalid API Key', success: false },
        { status: 401 }
      );
    }
    console.error('An unexpected error occurred:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}



import { GoogleGenerativeAI } from '@google/generative-ai';



