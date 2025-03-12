import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFormat'
})
export class CategoryFormatPipe implements PipeTransform {
  private categories = new Map<string, { label: string, color: string }>([
    ['fantasy', { label: 'Fantasy', color: 'rgba(205, 133, 63, 0.5)' }], // Burnt sienna
    ['scienceFiction', { label: 'Science Fiction', color: 'rgba(112, 128, 144, 0.7)' }], // Slate gray
    ['mysteryThriller', { label: 'Mystery & Thriller', color: 'rgba(82, 67, 57, 0.7)' }], // Deep walnut
    ['romance', { label: 'Romance', color: 'rgba(233, 150, 122, 0.7)' }], // Salmon pink
    ['horror', { label: 'Horror', color: 'rgba(139, 69, 19, 0.7)' }], // Saddle brown
    ['historicalFiction', { label: 'Historical Fiction', color: 'rgba(160, 82, 45, 0.7)' }], // Rust
    ['adventure', { label: 'Adventure', color: 'rgba(210, 180, 140, 0.7)' }], // Tan
    ['biography', { label: 'Biography', color: 'rgba(72, 61, 49, 0.7)' }], // Dark coffee
    ['memoir', { label: 'Memoir', color: 'rgba(205, 175, 149, 0.7)' }], // Warm sand
    ['selfHelp', { label: 'Self-Help', color: 'rgba(107, 142, 35, 0.7)' }], // Olive green
    ['travel', { label: 'Travel', color: 'rgba(189, 183, 107, 0.7)' }], // Khaki
    ['trueCrime', { label: 'True Crime', color: 'rgba(139, 0, 0, 0.7)' }], // Dark red
    ['scienceTechnology', { label: 'Science & Technology', color: 'rgba(70, 130, 180, 0.7)' }], // Steel blue
    ['history', { label: 'History', color: 'rgba(139, 105, 20, 0.7)' }], // Antique gold
    ['politics', { label: 'Politics', color: 'rgba(85, 107, 47, 0.7)' }], // Dark olive
    ['business', { label: 'Business', color: 'rgba(112, 97, 85, 0.7)' }], // Muted taupe
    ['sports', { label: 'Sports', color: 'rgba(154, 205, 50, 0.7)' }], // Yellow-green
    ['entertainment', { label: 'Entertainment', color: 'rgba(176, 101, 107, 0.7)' }], // Dusty rose
    ['health', { label: 'Health', color: 'rgba(102, 205, 170, 0.7)' }], // Medium aquamarine
    ['opinionEssays', { label: 'Opinion & Essays', color: 'rgba(75, 54, 33, 0.7)' }], // Deep chestnut
    ['socialIssues', { label: 'Social Issues', color: 'rgba(119, 136, 153, 0.7)' }], // Muted blue-gray
    ['inspirational', { label: 'Inspirational', color: 'rgba(244, 164, 96, 0.7)' }], // Sandy brown
    ['fanFiction', { label: 'Fan Fiction', color: 'rgba(186, 85, 211, 0.7)' }], // Muted orchid
    ['childrenStories', { label: 'Children Stories', color: 'rgba(255, 218, 185, 0.7)' }], // Peach puff
    ['youngAdult', { label: 'Young Adult', color: 'rgba(128, 128, 0, 0.7)' }] // Earthy olive
  ]);

  transform(value: string | null): { label: string, color: string } {
    if (!value) {
      return { label: '', color: '' };
    }
    return this.categories.get(value) || { label: this.formatLabel(value), color: 'gray' };
  }

  private formatLabel(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  }
}
