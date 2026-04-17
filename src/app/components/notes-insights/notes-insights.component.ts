import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Interfaces
export interface FinancialSection {
  id: string;
  name: string;
  category: 'personal' | 'income' | 'expenses' | 'assets' | 'insurance' | 'retirement' | 'goals';
  icon: string;
  color: string;
}

export interface Note {
  id: string;
  sectionId: string;
  title: string;
  content: string;
  type: 'advisor' | 'ai' | 'client';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
  isArchived: boolean;
}

export interface Insight {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  recommendation: string;
  impact: 'positive' | 'negative' | 'neutral' | 'warning';
  confidence: number; // 0-100
  source: 'ai_analysis' | 'advisor_expertise' | 'market_data';
  actionRequired: boolean;
  priority: number; // 1-5
  createdAt: Date;
  relatedNotes: string[];
}

@Component({
  selector: 'app-notes-insights',
  templateUrl: './notes-insights.component.html',
  styleUrls: ['./notes-insights.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class NotesInsightsComponent implements OnInit {
  @Input() clientId: string = '';
  @Output() notesUpdated = new EventEmitter<Note[]>();
  @Output() insightsUpdated = new EventEmitter<Insight[]>();

  // Forms - מאותחלים כברירת מחדל
  noteForm!: FormGroup;
  insightForm!: FormGroup;

  // Data
  financialSections: FinancialSection[] = [];
  notes: Note[] = [];
  insights: Insight[] = [];
  filteredNotes: Note[] = [];
  filteredInsights: Insight[] = [];

  // UI State
  activeTab: 'notes' | 'insights' | 'overview' = 'overview';
  selectedSection: string = 'all';
  selectedNoteType: string = 'all';
  selectedPriority: string = 'all';
  searchTerm: string = '';
  showAddNoteModal: boolean = false;
  showAddInsightModal: boolean = false;
  editingNote: Note | null = null;
  editingInsight: Insight | null = null;

  // AI Integration
  isAiAnalyzing: boolean = false;
  aiSuggestions: string[] = [];

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadFinancialSections();
    this.loadExistingData();
    this.applyFilters();
  }

  private initializeForms(): void {
    this.noteForm = this.fb.group({
      sectionId: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      type: ['advisor', Validators.required],
      priority: ['medium', Validators.required],
      tags: [''],
      author: ['', Validators.required]
    });

    this.insightForm = this.fb.group({
      sectionId: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      recommendation: ['', [Validators.required, Validators.maxLength(500)]],
      impact: ['neutral', Validators.required],
      confidence: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
      source: ['advisor_expertise', Validators.required],
      actionRequired: [false],
      priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  private loadFinancialSections(): void {
    // טעינה דינמית של הסעיפים - ניתן להחליף במקור נתונים חיצוני
    this.financialSections = [
      {
        id: 'monthly_income',
        name: 'הכנסות חודשיות',
        category: 'income',
        icon: 'trending-up',
        color: '#10b981'
      },
      {
        id: 'monthly_expenses',
        name: 'הוצאות חודשיות',
        category: 'expenses',
        icon: 'trending-down',
        color: '#f59e0b'
      },
      {
        id: 'assets',
        name: 'נכסים ונכסים פיננסיים',
        category: 'assets',
        icon: 'home',
        color: '#8b5cf6'
      },
      {
        id: 'insurance',
        name: 'ביטוחים',
        category: 'insurance',
        icon: 'shield',
        color: '#06b6d4'
      },
      {
        id: 'retirement_planning',
        name: 'תכנון פנסיוני',
        category: 'retirement',
        icon: 'clock',
        color: '#ec4899'
      },
      {
        id: 'financial_goals',
        name: 'יעדים פיננסיים',
        category: 'goals',
        icon: 'target',
        color: '#f97316'
      },
      {
        id: 'risk_analysis',
        name: 'ניתוח סיכונים',
        category: 'insurance',
        icon: 'alert-triangle',
        color: '#ef4444'
      },
      {
        id: 'investment_portfolio',
        name: 'תיק השקעות',
        category: 'assets',
        icon: 'pie-chart',
        color: '#a855f7'
      },
      {
        id: 'tax_planning',
        name: 'תכנון מס',
        category: 'expenses',
        icon: 'file-text',
        color: '#64748b'
      }
    ];
  }

  private loadExistingData(): void {
    // טעינה מקומית או מ-API
    const savedNotes = localStorage.getItem(`notes_${this.clientId}`);
    const savedInsights = localStorage.getItem(`insights_${this.clientId}`);

    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }

    if (savedInsights) {
      this.insights = JSON.parse(savedInsights);
    }
  }

  private saveData(): void {
    localStorage.setItem(`notes_${this.clientId}`, JSON.stringify(this.notes));
    localStorage.setItem(`insights_${this.clientId}`, JSON.stringify(this.insights));
    this.notesUpdated.emit(this.notes);
    this.insightsUpdated.emit(this.insights);
  }

  // Note Management
  openAddNoteModal(): void {
    this.editingNote = null;
    this.noteForm.reset({
      type: 'advisor',
      priority: 'medium',
      author: 'יועץ פיננסי' // ניתן להחליף עם נתוני המשתמש
    });
    this.showAddNoteModal = true;
  }

  editNote(note: Note): void {
    this.editingNote = note;
    this.noteForm.patchValue({
      sectionId: note.sectionId,
      title: note.title,
      content: note.content,
      type: note.type,
      priority: note.priority,
      tags: note.tags.join(', '),
      author: note.author
    });
    this.showAddNoteModal = true;
  }

  saveNote(): void {
    if (this.noteForm.valid) {
      const formValue = this.noteForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];

      if (this.editingNote) {
        // עדכון הערה קיימת
        const index = this.notes.findIndex(note => note.id === this.editingNote!.id);
        if (index !== -1) {
          this.notes[index] = {
            ...this.editingNote,
            ...formValue,
            tags,
            updatedAt: new Date()
          };
        }
      } else {
        // הוספת הערה חדשה
        const newNote: Note = {
          id: this.generateId(),
          ...formValue,
          tags,
          createdAt: new Date(),
          updatedAt: new Date(),
          isArchived: false
        };
        this.notes.push(newNote);
      }

      this.saveData();
      this.applyFilters();
      this.closeAddNoteModal();
    }
  }

  deleteNote(noteId: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק הערה זו?')) {
      this.notes = this.notes.filter(note => note.id !== noteId);
      this.saveData();
      this.applyFilters();
    }
  }

  toggleArchiveNote(noteId: string): void {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.isArchived = !note.isArchived;
      note.updatedAt = new Date();
      this.saveData();
      this.applyFilters();
    }
  }

  // Insight Management
  openAddInsightModal(): void {
    this.editingInsight = null;
    this.insightForm.reset({
      impact: 'neutral',
      confidence: 80,
      source: 'advisor_expertise',
      actionRequired: false,
      priority: 3
    });
    this.showAddInsightModal = true;
  }

  editInsight(insight: Insight): void {
    this.editingInsight = insight;
    this.insightForm.patchValue(insight);
    this.showAddInsightModal = true;
  }

  saveInsight(): void {
    if (this.insightForm.valid) {
      const formValue = this.insightForm.value;

      if (this.editingInsight) {
        // עדכון תובנה קיימת
        const index = this.insights.findIndex(insight => insight.id === this.editingInsight!.id);
        if (index !== -1) {
          this.insights[index] = {
            ...this.editingInsight,
            ...formValue,
            relatedNotes: this.editingInsight.relatedNotes || []
          };
        }
      } else {
        // הוספת תובנה חדשה
        const newInsight: Insight = {
          id: this.generateId(),
          ...formValue,
          createdAt: new Date(),
          relatedNotes: []
        };
        this.insights.push(newInsight);
      }

      this.saveData();
      this.applyFilters();
      this.closeAddInsightModal();
    }
  }

  deleteInsight(insightId: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק תובנה זו?')) {
      this.insights = this.insights.filter(insight => insight.id !== insightId);
      this.saveData();
      this.applyFilters();
    }
  }

  // AI Integration
  async generateAIInsights(sectionId?: string): Promise<void> {
    this.isAiAnalyzing = true;
    try {
      // כאן תתחבר למערכת AI
      // דוגמה לשילוב עם Claude או GPT
      await this.simulateAIAnalysis();
      
      // יצירת תובנות AI אוטומטיות
      const aiInsights = await this.createAIInsights(sectionId);
      this.insights.push(...aiInsights);
      
      this.saveData();
      this.applyFilters();
    } catch (error) {
      console.error('שגיאה בניתוח AI:', error);
    } finally {
      this.isAiAnalyzing = false;
    }
  }

  private async simulateAIAnalysis(): Promise<void> {
    // סימולציה של ניתוח AI
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async createAIInsights(sectionId?: string): Promise<Insight[]> {
    // דוגמה ליצירת תובנות AI
    const aiInsights: Insight[] = [
      {
        id: this.generateId(),
        sectionId: sectionId || 'monthly_expenses',
        title: 'זוהה פוטנציאל לחיסכון בהוצאות',
        description: 'הניתוח מראה שההוצאות על בידור גבוהות ב-23% מהממוצע לגיל ולהכנסה',
        recommendation: 'מומלץ להפחית הוצאות בידור ב-15% ולהעביר לחיסכון לטווח ארוך',
        impact: 'positive',
        confidence: 87,
        source: 'ai_analysis',
        actionRequired: true,
        priority: 4,
        createdAt: new Date(),
        relatedNotes: []
      }
    ];

    return aiInsights;
  }

  // Filtering and Search
  applyFilters(): void {
    let filteredNotes = [...this.notes];
    let filteredInsights = [...this.insights];

    // סינון לפי סעיף
    if (this.selectedSection !== 'all') {
      filteredNotes = filteredNotes.filter(note => note.sectionId === this.selectedSection);
      filteredInsights = filteredInsights.filter(insight => insight.sectionId === this.selectedSection);
    }

    // סינון לפי סוג הערה
    if (this.selectedNoteType !== 'all') {
      filteredNotes = filteredNotes.filter(note => note.type === this.selectedNoteType);
    }

    // סינון לפי עדיפות
    if (this.selectedPriority !== 'all') {
      filteredNotes = filteredNotes.filter(note => note.priority === this.selectedPriority);
    }

    // חיפוש טקסט
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
      
      filteredInsights = filteredInsights.filter(insight =>
        insight.title.toLowerCase().includes(searchLower) ||
        insight.description.toLowerCase().includes(searchLower) ||
        insight.recommendation.toLowerCase().includes(searchLower)
      );
    }

    // הסתרת הערות ארכיון (אלא אם מבוקש)
    filteredNotes = filteredNotes.filter(note => !note.isArchived);

    this.filteredNotes = filteredNotes;
    this.filteredInsights = filteredInsights;
  }

  // Utility Functions
  getSectionName(sectionId: string): string {
    const section = this.financialSections.find(s => s.id === sectionId);
    return section ? section.name : 'סעיף לא ידוע';
  }

  getSectionColor(sectionId: string): string {
    const section = this.financialSections.find(s => s.id === sectionId);
    return section ? section.color : '#64748b';
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#6b7280';
      default: return '#64748b';
    }
  }

  getImpactColor(impact: string): string {
    switch (impact) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'neutral': return '#6b7280';
      default: return '#64748b';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'advisor': return 'user';
      case 'ai': return 'zap';
      case 'client': return 'users';
      default: return 'file-text';
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Modal Controls
  closeAddNoteModal(): void {
    this.showAddNoteModal = false;
    this.editingNote = null;
    this.noteForm.reset();
  }

  closeAddInsightModal(): void {
    this.showAddInsightModal = false;
    this.editingInsight = null;
    this.insightForm.reset();
  }

  // Export/Import functionality
  exportData(): void {
    const data = {
      notes: this.notes,
      insights: this.insights,
      sections: this.financialSections,
      exportDate: new Date(),
      clientId: this.clientId
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial_notes_insights_${this.clientId}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  importData(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.notes && data.insights) {
            this.notes = data.notes;
            this.insights = data.insights;
            this.saveData();
            this.applyFilters();
            alert('הנתונים יובאו בהצלחה!');
          }
        } catch (error) {
          alert('שגיאה בקריאת הקובץ');
        }
      };
      reader.readAsText(file);
    }
  }

  // Statistics and Analytics
  getStatistics() {
    return {
      totalNotes: this.notes.length,
      activeNotes: this.notes.filter(n => !n.isArchived).length,
      totalInsights: this.insights.length,
      highPriorityItems: this.notes.filter(n => n.priority === 'high' || n.priority === 'critical').length +
                         this.insights.filter(i => i.priority >= 4).length,
      actionRequiredItems: this.insights.filter(i => i.actionRequired).length
    };
  }

  getNotesBySection() {
    const sectionStats = this.financialSections.map(section => ({
      section: section.name,
      count: this.notes.filter(note => note.sectionId === section.id && !note.isArchived).length,
      color: section.color
    }));
    return sectionStats;
  }
} 