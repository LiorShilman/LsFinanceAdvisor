
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { json } from 'express';
import { Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { GptApiService } from 'src/app/services/gpt-api.service';

@Component({
  selector: 'app-gpt-api',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gpt-api.component.html',
  styleUrls: ['./gpt-api.component.css']
})
export class GptApiComponent implements OnInit {
  @ViewChild('frameBox', { static: false }) frameBoxRef!: ElementRef;
  UploadFileName: string;
  UploadFileContent: string;
  chatMessages: { role: string, content: string }[] = [];
  chatConversation: Array<any> = [];
  promptText = '';
  WebSocket: WebSocketSubject<{ type: string, message: string }> = webSocket('ws://shilmanlior2608.ddns.net:8001');
  gptVersion: string;

  constructor(public gptApiService: GptApiService, public generalInfoService: GeneralInfoService) {

    this.UploadFileName = "";
    this.UploadFileContent = "";
    this.gptVersion = "gpt-4o";
    /* this.WebSocket.subscribe(
      msg => {
        if (msg.type == "log")
          console.log('message received: ' + msg.message)
        else if (msg.type == "chank") {
          let lastResult = this.chatConversation[this.chatConversation.length - 1];
          lastResult.response += msg.message.replace("|ENTER|", "\n");
          this.chatConversation[this.chatConversation.length - 1] = lastResult;
          //console.log('message received: ' + this.chatConversation[this.chatConversation.length - 1])
        }
        else {
          this.chatMessages.push({ "role": "assistant", "content": `${msg.message.replace("|ENTER|", "\n")}` });
          /* this.chatMessages.forEach(element => {
            console.log(element);
          }); 

        }
      },
      // Called whenever there is a message from the server    
      err => console.log(err),
      // Called if WebSocket API signals some kind of error    
      () => console.log('complete')
      // Called when connection is closed (for whatever reason)  
    ); */

    this.WebSocket.subscribe(
      msg => {
        if (msg.type == "log")
          console.log('message received: ' + msg.message)
        else if (msg.type == "chank") {
          let lastResult = this.chatConversation[this.chatConversation.length - 1];
          //console.log("---> - ", data);

          let isLineEnd = false;
        
          if (msg.message.includes("|ENTER|"))
            isLineEnd = true;

          // שלב את התוצאה החדשה עם התשובה הקיימת
          lastResult.response += msg.message.replace(/\|ENTER\|/g, '<br/>');

          if (isLineEnd) {
            // עיבוד התשובה המלאה
            lastResult.response = this.formatResponseChunk(lastResult.response);
            isLineEnd = false;
          }

          this.chatConversation[this.chatConversation.length - 1] = lastResult;

          // Ensure the DOM updates before scrolling
          setTimeout(() => {
            this.scrollToBottom(); // Scroll to the bottom after updating the message
          }, 0);
        }
        else {
          let lastResult = this.chatConversation[this.chatConversation.length - 1];
          this.chatConversation[this.chatConversation.length - 1] = lastResult;
    
          this.chatMessages.push({ "role": "assistant", "content": `${this.formatResponseChunk(msg.message.replace(/\|ENTER\|/g, '<br/>'))}` });
          this.promptText = "";
    
          // Ensure the DOM updates before scrolling
          setTimeout(() => {
            this.scrollToBottom(); // Scroll to the bottom after updating the message
          }, 0);
        }
      },
      // Called whenever there is a message from the server    
      err => console.log(err),
      // Called if WebSocket API signals some kind of error    
      () => console.log('complete')
      // Called when connection is closed (for whatever reason)  
    );


  }

  formatResponseChunk(chunk: string): string {
    return chunk
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // הדגשת טקסט שמסומן ב-**
      .replace(/(\d+\.\s)([^-\n]+)(?=\s-\s|$)/g, '$1<strong>$2</strong>')
      .replace(/####\s*(.+)/g, '<strong>$1</strong>') // Convert "####" to <h4> headers;
      .replace(/###\s*(.+)/g, '<strong>$1</strong>') // Convert "###" to <h4> headers;
      .replace(/##\s*(.+)/g, '<strong>$1</strong>')
      .replace(/#\s*(.+)/g, '<strong>$1</strong>');
  }


  scrollToBottom() {
    try {
      if (this.frameBoxRef && this.frameBoxRef.nativeElement) {
        setTimeout(() => {
          const frameBox = this.frameBoxRef.nativeElement;
          frameBox.scrollTop = frameBox.scrollHeight;
        }, 0); // Ensure the scroll happens after the view updates
      }
    } catch (err) {
      console.error('Error during scrollToBottom:', err);
    }
  }


  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // מונע מה-ENTER להוסיף שורה חדשה ב-textarea
      this.SendPrompt();   // מבצע את הלחיצה על הכפתור
    }
  }

  PushChatContent(content: string, person: string, cssClass: string) {
    const chatToPush: any = { person: person, response: content, cssClass: cssClass };
    this.chatConversation.push(chatToPush);
  }

  

  ngOnInit(): void {
    /*  this.gptApiService.subUpdateAssistentResultObservable$.subscribe((data) => {
       let lastResult = this.chatConversation[this.chatConversation.length - 1];
       lastResult.response += data;
       this.chatConversation[this.chatConversation.length - 1] = lastResult; 
     }*/

/*     let rule =
      `You are an expert finance advisor 
I am attaching complete financial data about my family.

Please give to me a detailed opinion based on the data I gave you, and divide the answer into 
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
        
please give me your opinion on the BDI credit rating in Israel for my family..

End your answer by providing tasks to be performed that can improve the financial situation 
according to the data I gave to you and provided  instructions regarding the management of the financial situation,
especially when it comes to my fixed expenses and the breakdown of variable expenses.

Specifically, I would like to know how to optimize my variable expenses and reduce discretionary expenses.`; */

let rule =
      `הקשר:
המשתמש הזין נתונים פיננסיים אישיים, כולל הכנסות, הוצאות, חובות, חסכונות, השקעות, ביטוחים ומטרות כלכליות. עליך לספק ניתוח מקיף ומפורט בהתבסס על הנתונים הללו, ולהציע פעולות לשיפור והתייעלות כלכלית. יש להתחשב בצרכים ובמטרות של המשתמש ולספק פתרונות מותאמים אישית, תוך התייחסות לתכנון פיננסי לטווח קצר וארוך.

#### מטרת הניתוח:####
ספק ניתוח פיננסי מקצועי ומעמיק בהתבסס על הנתונים שמסר המשתמש, תוך התייחסות לנקודות הבאות:

**ניתוח מפורט של ההכנסות וההוצאות:**
הערך האם המשתמש פועל במסגרת תקציבית. בחן את היחס בין הכנסות להוצאות, האם קיימת הזדמנות להגדלת הכנסות, והאם יש מקום לצמצום הוצאות.
השווה בין הוצאות קבועות להוצאות משתנות, ובדוק אילו סעיפים ניתן לשפר או להתייעל בהם.
חישוב החיסכון כאחוז מההכנסות הכוללות, והצעת דרכים להגדיל את שיעור החיסכון החודשי.

**חובות והתחייבויות:**
ניתוח ההתחייבויות הקיימות (כמו הלוואות או משכנתאות, אם קיימות), כולל אפשרויות לשיפור ניהול החובות באמצעות מחזור חוב או הפחתת עלויות מימון.
במידה ואין חובות, יש להתייחס לכך כחוזקה ולתת דגש על איך לנצל את יתרת ההון להשקעות או חיסכון נוסף.

**חסכונות והשקעות:**
ניתוח של כל תוכניות החיסכון וההשקעות, כולל בחינת דמי ניהול, פיזור סיכונים, ורמת התשואות. בדוק האם יש מקום להגדלת השקעות קיימות או לשינויים בפורטפוליו בהתאם ליעדי המשתמש.
הצע דרכים לשיפור התשואות על חסכונות והשקעות קיימים, ובחן אפשרויות להשקעות חדשות (כגון נדל"ן, שוק ההון, השקעות אלטרנטיביות וכו').

**תכנון פיננסי ארוך טווח:**
בחן את המטרות הכלכליות של המשתמש לאורך זמן, והכן תוכנית פיננסית המותאמת לצמיחה כלכלית ושיפור הביטחון הפיננסי. וודא שהמשתמש מתכנן לפרישה באופן מיטבי והצע דרכים לחיזוק תכנון הפנסיה והכיסוי הפנסיוני.
הצג תרחישים אפשריים לפרישה עם הערכה של קצבאות פנסיה, ביטוח מנהלים וקצבאות ביטוח לאומי, והצע התאמות במידת הצורך.

**ניהול סיכונים:**
הערך האם הביטוחים הקיימים מספקים כיסוי נאות (כגון ביטוח חיים, אובדן כושר עבודה, ביטוח סיעודי). בדוק אם קיימים פערים בניהול הסיכונים והצע דרכים למלא את הפערים הללו.
אם יש צורך, הצע ביטוחים נוספים בהתאם לצרכים האישיים של המשתמש ולמצבו המשפחתי והכלכלי.

**הצעות לפעולות ושיפורים:**
הצע המלצות פרקטיות לשיפור ההתנהלות הכלכלית, כולל הגדלת חיסכון חודשי, השקעות חדשות, שיפור תנאי החובות (אם קיימים), וניהול סיכונים טוב יותר.
בחן את פיזור ההשקעות הקיימות, ובצע בדיקה של חלופות שיניבו תשואה גבוהה יותר לאורך זמן תוך שמירה על איזון סיכונים ותשואות.

#### עיצוב והגשה:####
הצג את הניתוח בצורה מקצועית ומסודרת.
השתמש בכותרות ברורות עבור כל נושא (לדוגמה: הכנסות, הוצאות, חובות, חסכונות, השקעות, ביטוחים וכו').
שמור על מבנה היררכי ומאורגן, כאשר כל נושא מוצג בפסקה או נקודות נפרדות. השתמש בטבלאות ורשימות להצגת נתונים כמותיים (הכנסות, הוצאות, חובות, ונכסים) כדי להקל על הקריאה.
סיים עם סיכום כולל והמלצות לפעולות מידיות. הדגש נקודות מפתח בטקסט מודגש כדי שהמשתמש יוכל לזהות בקלות את ההמלצות החשובות ביותר.`;


    this.chatMessages.push({ "role": "system", "content": `${rule}` });
    this.PushChatContent(this.formatResponseChunk(rule.trim()), 'Role', 'system');
  }

  CheckResponse() {

    /*   this.gptApiService.sendPrompt([{"role": "assistant", "content": "what is a bananas?"}]).subscribe((data: any) => {
         this.chatMessages.push({"role": "assistant", "content": `${data.res}`});
         console.log(data);
         //this.PushChatContent(data.res.trim(), 'Assistant', 'assistant');
       }); */

    //this.chatMessages = [];

    //this.chatMessages.push({ "role": "user", "content": `${this.generalInfoService.AllInfo.GptAIQuestionEnglish}` });
    //this.PushChatContent(this.generalInfoService.AllInfo.GptAIQuestionEnglish.trim(), 'You', 'user');
    this.PushChatContent(this.formatResponseChunk(this.generalInfoService.AllInfo.GptAIQuestion.trim()), 'You', 'user');
    /*     this.chatMessages.push({ "role": "user", "content": "What is a banana?" });
        this.PushChatContent("What is a banana?", 'You', 'user');
     */
    this.PushChatContent("", 'Assistant', 'assistant');
    //this.gptApiService.sendPrompt({"role": "user", "content": `${this.generalInfoService.AllInfo.GptAIQuestionEnglish.trim()}`},this.gptVersion).subscribe((data: any) => {
    this.gptApiService.sendPrompt({"role": "user", "content": `${this.generalInfoService.AllInfo.GptAIQuestion.trim()}`},this.gptVersion).subscribe((data: any) => {
      //this.chatMessages.push({ "role": "assistant", "content": `${data.res}` });
      //this.PushChatContent(data.res.trim(), 'Assistant', 'Assistant');
    });
  }

  DeleteMessage(idx:number)
  {
    this.chatConversation.splice(idx,2);
  }

  SendPrompt() {
    this.PushChatContent(this.promptText, 'You', 'user');
    this.PushChatContent("", 'Assistant', 'assistant');
    //this.chatMessages.push({ "role": "user", "content": `${this.promptText}` });
    this.gptApiService.sendPrompt({"role": "user", "content": `${this.promptText}`},this.gptVersion).subscribe((data: any) => {
      //console.log("data.res - " + data.res);
      //this.chatMessages.push({ "role": "assistant", "content": `${data.res}` });
      //this.PushChatContent(data.res.trim(), 'Assistant', 'assistant');
    });
  }

  /* InvokeGPT() {
    
  } */


  /* async FileSelected(event: any) {

    const file: File = event.target.files[0];
    this.UploadFileName = file.name;
    await this.ReadFileContent(file);


    this.UploadFileName = file.name;
    this.UploadFileContent = await file.text();
    //get object from json file
    //let obj = JSON.parse(this.uploadFileContent);

    // Create a readable stream for the file
    const fileStream = fs.createReadStream(this.UploadFileContent);

    // Create a readline interface
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // For handling both CRLF and LF line endings
    });

    // Read the file line by line
    rl.on('line', (line) => {

      let lineObj = JSON.parse(line);
      this.chatMessages.push({ "role": `${lineObj.role}`, "content": `${lineObj.content}` });
      console.log(line); // Process each line here
    });

    // Handle the end of the file
    rl.on('close', () => {
      console.log('File reading complete.');
    });
   }*/ 

/*   async ReadFileContent(file: File) {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const fileContent = event.target.result;
      const lines = fileContent.split('\n');
      lines.forEach((line: string) => {
        let lineObj = JSON.parse(line);
        this.chatMessages.push({ "role": `${lineObj.role}`, "content": `${lineObj.content}` });
        console.log(line); // Process each line here
      });
    };

    reader.onerror = (event: any) => {
      console.error('Error reading file:', event.target.error);
    };

    reader.readAsText(file);
  }
 */
  FormatDateToCustomFormat(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}${month}${year}_${hours}${minutes}${seconds}`;
  }

  ReadFile() {
    this.gptApiService.ReadFromFile(this.generalInfoService.AllInfo.PersonalDataViewInfo.Id).subscribe((data: any) => {
      //console.log(data);
      this.chatConversation = data.chat;
      //this.chatMessages = data.gptChat;
    });
  }

  SaveFile() {
    console.log("SaveFile");
    const currentDate = new Date();
    //let fileNameGptChat = `chats/${this.generalInfoService.AllInfo.PersonalDataViewInfo.Id}.txt`;
    let fileNameChat = `chats/${this.generalInfoService.AllInfo.PersonalDataViewInfo.Id}_chat.txt`;
    //console.log("this.WriteToFile");
    let fileContent = "";

    this.chatConversation.forEach(element => {
      fileContent += `${element.person}:
${element.response}

`
    });
 
    let content2load = "";
    this.chatMessages.forEach(element => {
      content2load += `{ 'role': ${element.role}, 'content': ${element.content} }`;
      content2load += "\n";
    });

    //let fileName2upload = `AIReport_${this.generalInfoService.AllInfo.PersonalDataViewInfo.Name1}_${formattedDate}.txt`;
    //const file2uploadContent = new Blob([content2load], { type: "text/plain" });

    this.gptApiService.WriteToFile(this.chatConversation,fileNameChat).subscribe((data: any) => {


    });

    
    /* const link2upload = document.createElement("a");
    link2upload.href = URL.createObjectURL(file2uploadContent);
    link2upload.download = fileName2upload;
    link2upload.click();
    link2upload.remove();

    let fileName = `AIReport_${this.generalInfoService.AllInfo.PersonalDataViewInfo.Name1}_${formattedDate}_Report.txt`;
    const file = new Blob([fileContent], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    link.remove(); */
  }


}
