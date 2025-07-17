import { Component, OnInit } from '@angular/core';

interface Feedback {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];

  private counter = 0;

  constructor() {}

  ngOnInit(): void {}

  show(type: Feedback['type'], title: string, description?: string) {
    const id = this.counter++;
    this.feedbacks.push({ id, type, title, description });

    // Remove após 5s
    setTimeout(() => {
      this.feedbacks = this.feedbacks.filter((n) => n.id !== id);
    }, 5000);
  }

  remove(id: number) {
    this.feedbacks = this.feedbacks.filter((n) => n.id !== id);
  }
}
