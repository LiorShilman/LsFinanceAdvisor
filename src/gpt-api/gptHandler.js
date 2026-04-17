const openAi = require('openai');
const http = require('http');
const WebSocket = require('ws');
//const { OpenAI } = require("langchain/llms/openai");
//const { PromptTemplate } = require("langchain/prompts");
const { ChatOpenAI } = require("langchain/chat_models/openai");
//const { ChatMessageHistory } = require("langchain/memory");
const { ConversationSummaryBufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} = require("langchain/prompts");


const { ContextualCompressionRetriever } = require("langchain/retrievers/contextual_compression");


const server = http.createServer((req, res) => {
  res.end('Node.js Server');
});

const wss = new WebSocket.Server({ server });
let wsocket;

wss.on('connection', (ws) => {
  wsocket = ws;
  // WebSocket connection established
  wsocket.on('message', (message) => {
    // Handle incoming messages from the client
    console.log(`Received: ${message}`);
  });

  // Emit an event to the client
  wsocket.send(`{"type":"log","message": "Hello, Angular Client!"}`);
});

server.listen(8001, () => {
  console.log('Server is running on port 8001');
});


// We can also get the history as a list of messages (this is useful if you are using this with a chat prompt).
const chatPromptMemory = new ConversationSummaryBufferMemory({
  llm: new ChatOpenAI({ openAIApiKey: "OPENAI_API_KEY", modelName: "gpt-3.5-turbo", temperature: 0.9,streaming:true }),
  returnMessages: true,
});

class GPTApiHandler {

  constructor() {

   /*  this.configuration = new openAi.Configuration({
      apiKey: 'OPENAI_API_KEY'
    });
    this.openai = new openAi.OpenAIApi(this.configuration); */
  }

  /* sendRoleSystemPrompt(prompt) {
    try {
      const chatCompletion = this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: prompt
        }],
      });
      return chatCompletion.data.choices[0].message.content;
    } catch (error) {
      console.log(error);
      return "";
    }
  } */

  /*   async sendRoleUserPrompt(prompt) {
      try {
        const chatCompletion = await this.openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: prompt,
          temperature: 0.95
        });
        return chatCompletion.data.choices[0].message.content;
      }
      catch (error) {
        console.log(error);
        return "";
      }
    }
   */

  async saveMemory(content)
  {

    chatPromptMemory.clear();
    for(let i=0; i<content.length; i++)
    {
      if (content[i].person == "You")
      {
        if (content[i+1].response != "")
        {
           await chatPromptMemory.saveContext(
            { input: `${content[i].response}` },
            { output: `${content[i + 1].response.replace("|ENTER|",'\n')}` }
          );  
        }
        i++;
      }
    }
  }

  async sendRoleUserPrompt(prompt,gptVersion) {
    try {
      chatPromptMemory.llm.modelName=gptVersion;

   /*    const baseCompressor = new EmbeddingsFilter({
        embeddings: new OpenAIEmbeddings(),
        similarityThreshold: 0.8,
      }); */
      
      const chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
          `הקשר:
המשתמש הזין נתונים פיננסיים אישיים, כולל הכנסות, הוצאות, חובות, חסכונות, השקעות, ביטוחים ומטרות כלכליות. עליך לספק ניתוח מקיף ומפורט בהתבסס על הנתונים הללו, ולהציע פעולות לשיפור והתייעלות כלכלית. יש להתחשב בצרכים ובמטרות של המשתמש ולספק פתרונות מותאמים אישית, תוך התייחסות לתכנון פיננסי לטווח קצר וארוך.

מטרת הניתוח:
ספק ניתוח פיננסי מקצועי ומעמיק בהתבסס על הנתונים שמסר המשתמש, תוך התייחסות לנקודות הבאות:

ניתוח מפורט של ההכנסות וההוצאות:

הערך האם המשתמש פועל במסגרת תקציבית. בחן את היחס בין הכנסות להוצאות, האם קיימת הזדמנות להגדלת הכנסות, והאם יש מקום לצמצום הוצאות.
השווה בין הוצאות קבועות להוצאות משתנות, ובדוק אילו סעיפים ניתן לשפר או להתייעל בהם.
חישוב החיסכון כאחוז מההכנסות הכוללות, והצעת דרכים להגדיל את שיעור החיסכון החודשי.

חובות והתחייבויות:
ניתוח ההתחייבויות הקיימות (כמו הלוואות או משכנתאות, אם קיימות), כולל אפשרויות לשיפור ניהול החובות באמצעות מחזור חוב או הפחתת עלויות מימון.
במידה ואין חובות, יש להתייחס לכך כחוזקה ולתת דגש על איך לנצל את יתרת ההון להשקעות או חיסכון נוסף.

חסכונות והשקעות:
ניתוח של כל תוכניות החיסכון וההשקעות, כולל בחינת דמי ניהול, פיזור סיכונים, ורמת התשואות. בדוק האם יש מקום להגדלת השקעות קיימות או לשינויים בפורטפוליו בהתאם ליעדי המשתמש.
הצע דרכים לשיפור התשואות על חסכונות והשקעות קיימים, ובחן אפשרויות להשקעות חדשות (כגון נדל"ן, שוק ההון, השקעות אלטרנטיביות וכו').

תכנון פיננסי ארוך טווח:
בחן את המטרות הכלכליות של המשתמש לאורך זמן, והכן תוכנית פיננסית המותאמת לצמיחה כלכלית ושיפור הביטחון הפיננסי. וודא שהמשתמש מתכנן לפרישה באופן מיטבי והצע דרכים לחיזוק תכנון הפנסיה והכיסוי הפנסיוני.
הצג תרחישים אפשריים לפרישה עם הערכה של קצבאות פנסיה, ביטוח מנהלים וקצבאות ביטוח לאומי, והצע התאמות במידת הצורך.

ניהול סיכונים:
הערך האם הביטוחים הקיימים מספקים כיסוי נאות (כגון ביטוח חיים, אובדן כושר עבודה, ביטוח סיעודי). בדוק אם קיימים פערים בניהול הסיכונים והצע דרכים למלא את הפערים הללו.
אם יש צורך, הצע ביטוחים נוספים בהתאם לצרכים האישיים של המשתמש ולמצבו המשפחתי והכלכלי.

הצעות לפעולות ושיפורים:
הצע המלצות פרקטיות לשיפור ההתנהלות הכלכלית, כולל הגדלת חיסכון חודשי, השקעות חדשות, שיפור תנאי החובות (אם קיימים), וניהול סיכונים טוב יותר.
בחן את פיזור ההשקעות הקיימות, ובצע בדיקה של חלופות שיניבו תשואה גבוהה יותר לאורך זמן תוך שמירה על איזון סיכונים ותשואות.

עיצוב והגשה:
הצג את הניתוח בצורה מקצועית ומסודרת.
השתמש בכותרות ברורות עבור כל נושא (לדוגמה: הכנסות, הוצאות, חובות, חסכונות, השקעות, ביטוחים וכו').
שמור על מבנה היררכי ומאורגן, כאשר כל נושא מוצג בפסקה או נקודות נפרדות. השתמש בטבלאות ורשימות להצגת נתונים כמותיים (הכנסות, הוצאות, חובות, ונכסים) כדי להקל על הקריאה.
סיים עם סיכום כולל והמלצות לפעולות מידיות. הדגש נקודות מפתח בטקסט מודגש כדי שהמשתמש יוכל לזהות בקלות את ההמלצות החשובות ביותר.`
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
      ]);

      /* const chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
          `You are an expert finance advisor 
          I am attaching complete financial data about my family.

          Please give a detailed opinion based on the data I gave you, and divide the answer into 
          different categories.

          For each subject please indicate:
          * The financial figure on which you base your answer.
          * Regarding the various expenses (monthly savings and investments, fixed and variable expenses) 
            what is the percentage of the monthly family income.
          * Statistics in Israel compared with the data I provided you about myself.
          * Analysis (numerical data) that can give a clearer and more accurate explanation 
            of the specific category and ways to improve/optimize.
              
          Finally, answer the following questions:
          Is my financial management correct?
          What can be improved in my financial management?
          If there is a mortgage, please give your opinion on the different routes and advice for improvement.

          please עive your opinion on the BDI credit rating in Israel of the given family.
              
          End your answer by providing tasks to be performed that can improve the financial situation 
          according to the data I gave to you and provide instructions regarding the management of the financial situation,
          especially when it comes to my fixed expenses and the breakdown of variable expenses.

          Specifically, I would like to know how to optimize my variable expenses and reduce discretionary expenses.`
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
      ]); */

      const chain = new ConversationChain({
        llm: new ChatOpenAI({ openAIApiKey: "OPENAI_API_KEY", modelName: "gpt-4o",temperature: 0.9 ,verbose: true ,streaming:true}),
        memory: chatPromptMemory,
        prompt: chatPrompt,
      });

      let chatgptResponse = { role: 'assistant', content: '' };

      const res1 = await chain.call({ input: prompt.content,
        callbacks: [
          {
            handleLLMNewToken(token) {
              console.log(token);
              chatgptResponse.content += token;
              wsocket.send(JSON.stringify({
                type: "chank",
                message: token.replace(/[\u0000-\u0019]+/g, "|ENTER|") // Replace problematic control characters
              }));
            },
            handleLLMEnd() {
              console.log(chatgptResponse.content);
              wsocket.send(JSON.stringify({
                type: "finish",
                message: chatgptResponse.content.replace(/[\u0000-\u0019]+/g, "|ENTER|") // Replace control characters
              }));
              return chatgptResponse.content;
            }
          }
        ]
      });

      //const res1 = await chain.predict({ input: prompt });
      //console.log({ res1 });

      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");


      //await chatPromptMemory.saveContext({ input: "hi" }, { output: "whats up" });
      //await chatPromptMemory.saveContext(
      //  { input: "not much you" },
      //  { output: "not much" }
      //);

      //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      //let messages = await chatPromptMemory.chatHistory.getMessages();
      //let previous_summary = "";
      //let predictSummary = await chatPromptMemory.predictNewSummary(
      //  messages,
      //  previous_summary
      //);
      //console.log(JSON.stringify(predictSummary));
      //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

      // Using in a chain
      // Let's walk through an example, again setting verbose to true so we can see the prompt.
      /* let chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
          "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
        ),
        new MessagesPlaceholder("history"),
        HumanMessagePromptTemplate.fromTemplate("{input}"),
      ]); */

      /* let model = new ChatOpenAI({ openAIApiKey: "OPENAI_API_KEY",temperature: 0.9, verbose: true });
      let chain = new ConversationChain({
        llm: model,
        memory: chatPromptMemory,
        prompt: chatPrompt
      }); */

      /* let res1 = await chain.predict({ input: "Hi, what's up?" });
      console.log({ res1 }); */

      //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

/*       predictSummary = await chatPromptMemory.predictNewSummary(
        messages,
        previous_summary
      );
      console.log(JSON.stringify(predictSummary));
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"); */

      /*
        {
          res1: 'Hello! I am an AI language model, always ready to have a conversation. How can I assist you today?'
        }
      */

        /*
      const res2 = await chain.predict({
        input: "Just working on writing some documentation!",
      });
      console.log({ res2 });
      /*
        {
          res2: "That sounds productive! Documentation is an important aspect of many projects. Is there anything specific you need assistance with regarding your documentation? I'm here to help!"
        }
      */

        /*
      const res3 = await chain.predict({
        input: "For LangChain! Have you heard of it?",
      });
      console.log({ res3 });
      /*
        {
          res3: 'Yes, I am familiar with LangChain! It is a blockchain-based language learning platform that aims to connect language learners with native speakers for real-time practice and feedback. It utilizes smart contracts to facilitate secure transactions and incentivize participation. Users can earn tokens by providing language learning services or consuming them for language lessons.'
        }
      */
     /*

      const res4 = await chain.predict({
        input:
          "That's not the right one, although a lot of people confuse it for that!",
      });
      console.log({ res4 });

      const promptTemplate = PromptTemplate.fromTemplate(
        "Tell me a joke about {topic}"
      );

      /*      const chain = promptTemplate.pipe(chatModel);
           const stream = await chain.stream({ topic: "bears" });
           for await (const chunk of stream) {
             console.log(chunk?.content);
           } */



      /*
      const chatCompletion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: prompt,
        stream: true
      },
        { responseType: 'stream' });

      if (chatCompletion.data instanceof http.IncomingMessage) {
        const stream = chatCompletion.data;
        // rest of your code
        let chatgptResponse = { role: 'assistant', content: '' };
        stream.on('data', (chunk) => {
          const payloads = chunk.toString().split('\n\n');
          for (const payload of payloads) {
            if (payload.includes('[DONE]')) return;
            if (payload.startsWith('data:')) {
              const data = JSON.parse(payload.replace('data: ', ''));
              try {
                const chunk = data.choices[0].delta?.content.replace(/[\u0000-\u0019]+/g,"|ENTER|");
                if (chunk) {
                  chatgptResponse.content += chunk;
                  console.log(`${chunk}`);
                  wsocket.send(`{"type":"chank","message": "${chunk}"}`);
                }
              } catch (err) {
                console.log(`Error with JSON.parse and ${payload}.\n${err}`);
                //io.emit('resError', { chatID: chatID, error: err });
              }
            }
          }
        });

        stream.on('end', async () => {
          // save chatgpt response to db
          //              console.log(`
          //  chatgptResponse - ${chatgptResponse.content}`);
          //const newChatgptMessage = new Message({ chatID: chatID, role: chatgptResponse.role, content: chatgptResponse.content });
          //await newChatgptMessage.save();
          //io.emit('newMessage', { chatID: chatID });

          // get chat title
          //const chat = await Conversation.findOne({ _id: chatID });
          //const chatTitle = chat?.title;

          // send chatgpt response to client
          //io.emit('updatedChats');
          //res.status(200).send({ message: 'Res sent', GPTResponse: chatgptResponse});
          //wsocket.send(`{ "type":"done","message": ${chatgptResponse.content}}`);

          console.log("*****************************************************************************")
          console.log("FINISH")
          console.log("*****************************************************************************")
          wsocket.send(`{"type":"finish","message": "${chatgptResponse.content.replace(/[\u0000-\u0019]+/g,"|ENTER|")}"}`);
          return chatgptResponse.content;
        });

        stream.on('error', (err) => {
          console.log(err);
          //io.emit('resError', { chatID: chatID, error: err });
        });

      }*/

    } catch (error) {
      console.log(error);
      return "";
    }
  }

  /*  try {
     return "Test from AI"
      const chatCompletion = await this.openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
       messages: prompt,
       temperature: 0.95
     });
     return chatCompletion.data.choices[0].message.content;
   } catch (error) {
     console.log(error);
     return "";
   } */
  //  }
}

module.exports = GPTApiHandler;
