import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  speechSynthesis: SpeechSynthesis;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
  }

  speak(text: string, lang: string = 'he-IL'): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // Set language to Hebrew
    const voices = this.speechSynthesis.getVoices();
    const hebrewVoice = voices.find(voice => voice.lang === 'he-IL');
    if (hebrewVoice) {
      utterance.voice = hebrewVoice; // Set Hebrew voice if available
    }
    this.speechSynthesis.speak(utterance);
  }  

  stopSpeaking(): void {
    this.speechSynthesis.cancel();
  }

}