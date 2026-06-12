import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { Card } from 'primeng/card';

import { Avatar } from 'primeng/avatar';

import { Tooltip } from 'primeng/tooltip';

import { User } from '../../core/models/user.model';

import { Writing } from '../../core/models/writing.model';
import {
  appendPlainTextToWritingHtml,
  htmlToPlainText,
  isWritingHtmlEmpty,
  resolveWritingHtml,
} from '../../core/utils/writing-html.utils';

import { MenuItem, ConfirmationService } from 'primeng/api';

import { Divider } from 'primeng/divider';

import { Textarea } from 'primeng/textarea';

import { Button } from 'primeng/button';

import { ConfirmDialog } from 'primeng/confirmdialog';

import { Message } from 'primeng/message';

import { SelectButton } from 'primeng/selectbutton';

import { Menu } from 'primeng/menu';
import { Tag } from 'primeng/tag';

import { Story } from '../../core/models/story.model';
import { Category } from '../../core/models/category.model';
import { CategoryFormatPipe } from '../../core/pipes/category-format.pipe';

import { StoryService } from '../../core/services/story.service';

import { WritingService } from '../../core/services/writing.service';

import { Comment, COMMENT_DROPDOWN_REACTION_EMOJIS, CommentReactionEmoji, commentAuthorName, commentCreatedAt, commentIsMine, commentLikedByMe, commentLikesCount, commentTimestamp, reactionIsMine } from '../../core/models/comment.model';

import { CommentService } from '../../core/services/comment.service';

import { AuthService } from '../../core/services/auth.service';

import {
  resolveAvatarUrl,
  withCacheBust,
} from '../../core/utils/media.utils';

import { AuthorFavoriteIconComponent } from '../../shared/components/author-favorite-icon/author-favorite-icon.component';
import { PageBreadcrumbComponent } from '../../shared/components/page-breadcrumb/page-breadcrumb.component';
import { WritingAssistPanelComponent } from '../../shared/components/writing-assist-panel/writing-assist-panel.component';
import { WritingContentComponent } from '../../shared/components/writing-content/writing-content.component';
import { WritingRichEditorComponent } from '../../shared/components/writing-rich-editor/writing-rich-editor.component';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProfileService } from '../../core/services/profile.service';

type CommentSortFilter = 'recent' | 'oldest' | 'relevant';



@Component({

  selector: 'app-story-details',

  imports: [

    FormsModule,

    Avatar,

    Tooltip,

    Divider,

    Textarea,

    Card,

    Button,

    Message,

    ConfirmDialog,

    SelectButton,

    PageBreadcrumbComponent,
    WritingAssistPanelComponent,
    WritingContentComponent,
    WritingRichEditorComponent,
    AuthorFavoriteIconComponent,

    Menu,

    RouterLink,

    Tag,
    CategoryFormatPipe,

    TranslatePipe,

  ],

  providers: [ConfirmationService],

  templateUrl: './story-details.component.html',

  styleUrl: './story-details.component.scss'

})

export class StoryDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('reactionMenu') reactionMenu!: Menu;

  private readonly storyService = inject(StoryService);

  private readonly writingService = inject(WritingService);

  private readonly commentService = inject(CommentService);

  private readonly authService = inject(AuthService);

  private readonly profileService = inject(ProfileService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly confirmationService = inject(ConfirmationService);

  private readonly translate = inject(TranslateService);

  private readonly destroyRef = inject(DestroyRef);

  story: WritableSignal<Story | null> = this.storyService.story;

  readonly currentUser = this.authService.currentUser;

  readonly favoriteStoryIds = signal<Set<number>>(new Set());

  readonly favoriteAuthorIds = signal<Set<number>>(new Set());

  readonly showWritingEditor = signal(false);

  readonly newWritingHtml = signal('');

  readonly savingWriting = signal(false);

  readonly writingError = signal<string | null>(null);



  readonly deletingStory = signal(false);

  readonly newCommentText = signal('');

  readonly submittingComment = signal(false);

  readonly commentError = signal<string | null>(null);

  readonly editingCommentId = signal<number | null>(null);

  readonly editingCommentText = signal('');

  readonly savingCommentId = signal<number | null>(null);

  readonly deletingCommentId = signal<number | null>(null);

  readonly reactingCommentId = signal<number | null>(null);

  readonly dropdownReactionEmojis = COMMENT_DROPDOWN_REACTION_EMOJIS;

  readonly activeReactionComment = signal<Comment | null>(null);

  readonly reactionMenuItems = computed<MenuItem[]>(() =>
    this.dropdownReactionEmojis.map((emoji) => ({
      label: emoji,
      command: () => {
        const comment = this.activeReactionComment();
        if (comment) {
          this.reactToComment(comment, emoji);
        }
      },
    }))
  );

  readonly commentFilter = signal<CommentSortFilter>('recent');

  readonly typingAuthors = signal<string[]>([]);

  readonly commentFilterOptions = signal<
    { label: string; value: CommentSortFilter }[]
  >([]);

  readonly shareMessage = signal<string | null>(null);

  private readonly langTick = signal(0);

  readonly commentCreatedAt = commentCreatedAt;
  readonly commentLikedByMe = commentLikedByMe;
  readonly commentLikesCount = commentLikesCount;
  readonly reactionIsMine = reactionIsMine;

  readonly filteredComments = computed(() => {
    const comments = [...(this.story()?.comments ?? [])];
    const filter = this.commentFilter() ?? 'recent';

    if (filter === 'relevant') {
      return this.sortCommentsByDate(
        comments.filter((comment) => this.hasEngagedWith(comment)),
        'desc'
      );
    }

    return this.sortCommentsByDate(comments, filter === 'oldest' ? 'asc' : 'desc');
  });

  readonly hasComments = computed(() => (this.story()?.comments?.length ?? 0) > 0);

  readonly breadcrumbItems = computed<MenuItem[]>(() => {
    this.langTick();
    return [
      { label: this.translate.instant('nav.stories'), routerLink: '/dashboard' },
      { label: this.story()?.title ?? this.translate.instant('common.story') },
    ];
  });

  readonly storyAuthorAvatarUrl = computed(() => {
    const author = this.story()?.author;
    return withCacheBust(
      resolveAvatarUrl(author),
      author?.avatarUpdated ?? author?.avatar_updated ?? null
    );
  });

  readonly storyCategories = computed((): Category[] => {
    const story = this.story();
    if (!story) {
      return [];
    }
    return story.categories?.length ? story.categories : story.categoryObjects ?? [];
  });

  readonly resolveWritingHtml = resolveWritingHtml;
  readonly htmlToPlainText = htmlToPlainText;

  storyId: number | null = null;

  private typingPollInterval?: ReturnType<typeof setInterval>;

  private typingDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.refreshCommentFilterOptions();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.langTick.update((value) => value + 1);
        this.refreshCommentFilterOptions();
      });

    this.loadFavorites();
    this.getStoryDetails();
  }

  onCommentFilterChange(value: CommentSortFilter | null): void {
    if (value === 'recent' || value === 'oldest' || value === 'relevant') {
      this.commentFilter.set(value);
    } else {
      this.commentFilter.set('recent');
    }
  }

  private refreshCommentFilterOptions(): void {
    this.commentFilterOptions.set([
      {
        label: this.translate.instant('storyDetails.commentRecent'),
        value: 'recent',
      },
      {
        label: this.translate.instant('storyDetails.commentOldest'),
        value: 'oldest',
      },
      {
        label: this.translate.instant('storyDetails.commentRelevant'),
        value: 'relevant',
      },
    ]);
  }

  private loadFavorites(): void {
    if (!this.currentUser()) {
      return;
    }

    forkJoin({
      favoriteIds: this.profileService.getFavoriteStoryIds(),
      favoriteAuthors: this.profileService.getFavoriteAuthors(),
    }).subscribe({
      next: ({ favoriteIds, favoriteAuthors }) => {
        this.favoriteStoryIds.set(new Set(favoriteIds));
        this.favoriteAuthorIds.set(new Set(favoriteAuthors.author_ids ?? []));
      },
    });
  }

  ngOnDestroy(): void {
    this.stopTypingPoll();
    this.stopTypingPulse();
    this.typingAuthors.set([]);
  }

  typingLabel(): string {
    const authors = this.typingAuthors();
    if (authors.length === 1) {
      return this.translate.instant('storyDetails.typingOne', { author: authors[0] });
    }
    if (authors.length === 2) {
      return this.translate.instant('storyDetails.typingTwo', {
        first: authors[0],
        second: authors[1],
      });
    }
    return this.translate.instant('storyDetails.typingMany');
  }

  onWritingInput(value: string): void {
    this.newWritingHtml.set(value);
    this.scheduleTypingPulse();
  }

  private scheduleTypingPulse(): void {
    if (!this.showWritingEditor() || !this.storyId) {
      return;
    }

    clearTimeout(this.typingDebounce);
    this.typingDebounce = setTimeout(() => {
      if (!this.showWritingEditor() || !this.storyId) {
        return;
      }
      this.storyService.sendTypingPulse(this.storyId).subscribe();
    }, 300);
  }

  private stopTypingPulse(): void {
    clearTimeout(this.typingDebounce);
    this.typingDebounce = undefined;
  }

  private stopTypingPoll(): void {
    if (this.typingPollInterval) {
      clearInterval(this.typingPollInterval);
      this.typingPollInterval = undefined;
    }
  }

  private startTypingPoll(storyId: number): void {
    this.stopTypingPoll();
    this.refreshTypingStatus(storyId);
    this.typingPollInterval = setInterval(() => this.refreshTypingStatus(storyId), 2000);
  }

  private refreshTypingStatus(storyId: number): void {
    this.storyService.getTypingStatus(storyId).subscribe({
      next: (response) => {
        this.typingAuthors.set(response.typers.map((typer) => typer.author_name));
      },
    });
  }

  isMyComment(comment: Comment): boolean {
    if (commentIsMine(comment)) {
      return true;
    }
    return this.isAuthorMe(comment.author as User | null);
  }

  commentAuthorName(comment: Comment): string {
    return commentAuthorName(comment);
  }

  formatCommentDate(value: string | null | undefined): string {
    const dateValue = value ?? null;
    if (!dateValue) {
      return '';
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  submitComment(): void {
    const content = this.newCommentText().trim();
    const storyId = Number(this.story()?.id);

    if (!content) {
      this.commentError.set(this.translate.instant('storyDetails.commentEmptySubmit'));
      return;
    }

    if (!storyId) {
      this.commentError.set(this.translate.instant('storyDetails.storyNotFound'));
      return;
    }

    this.submittingComment.set(true);
    this.commentError.set(null);

    this.commentService.createComment({ story_id: storyId, content }).subscribe({
      next: (comment) => {
        this.story.update((current) =>
          current
            ? { ...current, comments: [comment, ...(current.comments ?? [])] }
            : current
        );
        this.newCommentText.set('');
        this.submittingComment.set(false);
      },
      error: (err) => {
        this.submittingComment.set(false);
        this.commentError.set(
          err.error?.detail ??
            err.error?.content?.[0] ??
            this.translate.instant('storyDetails.commentPostError')
        );
      },
    });
  }

  startEditComment(comment: Comment): void {
    if (!comment.id) {
      return;
    }
    this.editingCommentId.set(comment.id);
    this.editingCommentText.set(comment.content ?? '');
    this.commentError.set(null);
  }

  cancelEditComment(): void {
    this.editingCommentId.set(null);
    this.editingCommentText.set('');
  }

  saveEditedComment(comment: Comment): void {
    const content = this.editingCommentText().trim();
    if (!comment.id || !content) {
      this.commentError.set(this.translate.instant('storyDetails.commentEmpty'));
      return;
    }

    this.savingCommentId.set(comment.id);
    this.commentError.set(null);

    this.commentService.updateComment(comment.id, { content }).subscribe({
      next: (updated) => {
        this.replaceComment(updated);
        this.savingCommentId.set(null);
        this.cancelEditComment();
      },
      error: (err) => {
        this.savingCommentId.set(null);
        this.commentError.set(
          err.error?.detail ??
            err.error?.content?.[0] ??
            this.translate.instant('storyDetails.commentUpdateError')
        );
      },
    });
  }

  confirmDeleteComment(comment: Comment): void {
    if (!comment.id) {
      return;
    }

    this.confirmationService.confirm({
      message: this.translate.instant('storyDetails.deleteComment.message'),
      header: this.translate.instant('storyDetails.deleteComment.header'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deletingCommentId.set(comment.id);
        this.commentService.deleteComment(comment.id!).subscribe({
          next: () => {
            this.story.update((current) =>
              current
                ? {
                    ...current,
                    comments: (current.comments ?? []).filter((item) => item.id !== comment.id),
                  }
                : current
            );
            this.deletingCommentId.set(null);
          },
          error: () => {
            this.deletingCommentId.set(null);
            this.commentError.set(this.translate.instant('storyDetails.commentDeleteError'));
          },
        });
      },
    });
  }

  toggleCommentLike(comment: Comment): void {
    if (!comment.id || this.isMyComment(comment)) {
      return;
    }

    this.commentService.toggleLike(comment.id).subscribe({
      next: (updated) => this.replaceComment(updated),
      error: () =>
        this.commentError.set(this.translate.instant('storyDetails.commentLikeError')),
    });
  }

  hasEngagedWith(comment: Comment): boolean {
    if (commentLikedByMe(comment)) {
      return true;
    }
    return (comment.reactions ?? []).some((reaction) => reactionIsMine(reaction));
  }

  filteredCommentsLabel(): string {
    const total = this.story()?.comments?.length ?? 0;
    const visible = this.filteredComments().length;
    const filter = this.commentFilter() ?? 'recent';

    if (filter === 'relevant') {
      return visible === 1
        ? this.translate.instant('storyDetails.commentsLabel.relevantOne')
        : this.translate.instant('storyDetails.commentsLabel.relevantMany', { count: visible });
    }

    if (filter === 'oldest') {
      return this.translate.instant('storyDetails.commentsLabel.oldest');
    }

    if (visible !== total) {
      return this.translate.instant('storyDetails.commentsLabel.partial', {
        visible,
        total,
      });
    }

    return this.translate.instant('storyDetails.commentsLabel.recent');
  }

  openReactionMenu(event: Event, comment: Comment): void {
    this.activeReactionComment.set(comment);
    this.reactionMenu.toggle(event);
  }

  reactToComment(comment: Comment, emoji: CommentReactionEmoji | string): void {
    if (!comment.id || this.isMyComment(comment)) {
      return;
    }

    this.reactingCommentId.set(comment.id);
    this.commentService.react(comment.id, emoji as CommentReactionEmoji).subscribe({
      next: (updated) => {
        this.replaceComment(updated);
        this.reactingCommentId.set(null);
      },
      error: () => {
        this.reactingCommentId.set(null);
        this.commentError.set(this.translate.instant('storyDetails.commentReactionError'));
      },
    });
  }

  private replaceComment(updated: Comment): void {
    this.story.update((current) =>
      current
        ? {
            ...current,
            comments: (current.comments ?? []).map((item) =>
              item.id === updated.id ? updated : item
            ),
          }
        : current
    );
  }

  private sortCommentsByDate(comments: Comment[], order: 'asc' | 'desc'): Comment[] {
    return [...comments].sort((left, right) => {
      const leftTime = commentTimestamp(left);
      const rightTime = commentTimestamp(right);
      if (leftTime !== rightTime) {
        return order === 'asc' ? leftTime - rightTime : rightTime - leftTime;
      }
      const leftId = left.id ?? 0;
      const rightId = right.id ?? 0;
      return order === 'asc' ? leftId - rightId : rightId - leftId;
    });
  }

  printStory(): void {
    window.print();
  }

  shareStory(): void {
    const story = this.story();
    if (!story?.id) {
      return;
    }

    const url = `${window.location.origin}/story-details/${story.id}`;
    const title = story.title ?? 'Story';
    const sharePayload = { title, text: title, url };

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share(sharePayload).catch(() => undefined);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(url).then(() => {
        this.shareMessage.set(this.translate.instant('storyDetails.shareCopied'));
      });
      return;
    }

    window.prompt('Copy this link to share the story:', url);
  }

  confirmDeleteStory(): void {
    const storyId = this.story()?.id;
    if (!storyId) {
      return;
    }

    this.confirmationService.confirm({
      message: this.translate.instant('storyDetails.deleteStory.message'),
      header: this.translate.instant('storyDetails.deleteStory.header'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deletingStory.set(true);
        this.storyService.deleteStory(storyId).subscribe({
          next: () => {
            this.deletingStory.set(false);
            this.storyService.story.set(null);
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.deletingStory.set(false);
          },
        });
      },
    });
  }



  storyAuthorName(): string {
    const author = this.story()?.author;
    return author?.author_name ?? this.story()?.author_name ?? 'Unknown';
  }

  writingAuthorAvatarUrl(writing: Writing): string | null {
    const author = writing.author;
    return withCacheBust(
      resolveAvatarUrl(author),
      author?.avatarUpdated ?? author?.avatar_updated ?? null
    );
  }

  private appendWritingToStory(writing: Writing): void {
    this.story.update((current) =>
      current
        ? { ...current, writings: [...(current.writings ?? []), writing] }
        : current
    );
  }

  storyAuthorQueryParams(): { author: string } | null {
    if (this.isMyStory()) {
      return { author: '__me__' };
    }
    const name = this.storyAuthorName();
    return name !== 'Unknown' ? { author: name } : null;
  }

  writingAuthorName(writing: Writing): string {
    return writing.author?.author_name ?? writing.author_name ?? 'Unknown';
  }

  writingAuthorId(writing: Writing): number | null {
    const id = writing.author?.id;
    return id != null ? Number(id) : null;
  }

  writingAuthorQueryParams(writing: Writing): { author: string } | null {
    if (this.isMyWriting(writing)) {
      return { author: '__me__' };
    }
    const name = this.writingAuthorName(writing);
    return name !== 'Unknown' ? { author: name } : null;
  }

  isStoryFavorited(): boolean {
    const storyId = Number(this.story()?.id);
    return storyId > 0 && this.favoriteStoryIds().has(storyId);
  }

  isAuthorFavorited(authorId: number | null): boolean {
    return authorId != null && this.favoriteAuthorIds().has(authorId);
  }

  canFavoriteAuthor(authorId: number | null): boolean {
    if (!authorId || !this.currentUser()) {
      return false;
    }
    return Number(this.currentUser()!.id) !== Number(authorId);
  }

  toggleStoryFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const storyId = Number(this.story()?.id);
    if (!storyId) {
      return;
    }

    if (this.isStoryFavorited()) {
      this.profileService.removeFavorite(storyId).subscribe({
        next: () => {
          const next = new Set(this.favoriteStoryIds());
          next.delete(storyId);
          this.favoriteStoryIds.set(next);
        },
      });
      return;
    }

    this.profileService.addFavorite(storyId).subscribe({
      next: () => {
        const next = new Set(this.favoriteStoryIds());
        next.add(storyId);
        this.favoriteStoryIds.set(next);
      },
    });
  }

  toggleAuthorFavorite(event: Event, authorId: number | null): void {
    event.preventDefault();
    event.stopPropagation();

    if (!authorId || !this.canFavoriteAuthor(authorId)) {
      return;
    }

    if (this.isAuthorFavorited(authorId)) {
      this.profileService.removeFavoriteAuthor(authorId).subscribe({
        next: () => {
          const next = new Set(this.favoriteAuthorIds());
          next.delete(authorId);
          this.favoriteAuthorIds.set(next);
        },
      });
      return;
    }

    this.profileService.addFavoriteAuthor(authorId).subscribe({
      next: () => {
        const next = new Set(this.favoriteAuthorIds());
        next.add(authorId);
        this.favoriteAuthorIds.set(next);
      },
    });
  }

  isMyWriting(writing: Writing): boolean {
    if (this.isAuthorMe(writing.author)) {
      return true;
    }
    const user = this.currentUser();
    return !!user?.author_name && user.author_name === writing.author_name;
  }

  isMyStory(): boolean {
    return this.isAuthorMe(this.story()?.author);
  }

  isAuthorMe(author: User | null | undefined): boolean {
    const user = this.currentUser();
    if (!user || !author) {
      return false;
    }
    if (user.id != null && author.id != null) {
      return Number(user.id) === Number(author.id);
    }
    if (user.email && author.email) {
      return user.email === author.email;
    }
    return user.author_name === author.author_name;
  }

  formatWritingDate(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    const pad = (part: number) => part.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}, ${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  }

  openWritingEditor(): void {

    this.writingError.set(null);

    this.showWritingEditor.set(true);

  }

  onAssistInsert(text: string): void {
    const current = this.newWritingHtml();
    this.newWritingHtml.set(appendPlainTextToWritingHtml(current, text));
    this.scheduleTypingPulse();
  }



  cancelWritingEditor(): void {

    this.showWritingEditor.set(false);

    this.newWritingHtml.set('');

    this.writingError.set(null);

    this.stopTypingPulse();

  }



  saveWriting(): void {

    const text = this.newWritingHtml();

    const storyId = Number(this.story()?.id);



    if (isWritingHtmlEmpty(text)) {

      this.writingError.set(this.translate.instant('storyDetails.writingEmpty'));

      return;

    }



    if (!storyId) {

      this.writingError.set(this.translate.instant('storyDetails.storyNotFound'));

      return;

    }



    this.savingWriting.set(true);

    this.writingError.set(null);



    this.writingService
      .createWriting({ story: storyId, text })
      .subscribe({
      next: (writing) => {
        this.appendWritingToStory(writing);
        this.savingWriting.set(false);
        this.cancelWritingEditor();
      },
      error: (err) => {
        this.savingWriting.set(false);
        this.writingError.set(
          err.error?.detail ?? this.translate.instant('newStory.createError')
        );
      },
    });

  }



  private getStoryDetails(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        if (this.storyId !== id) {
          this.cancelWritingEditor();
          this.stopTypingPoll();
          this.typingAuthors.set([]);
        }
        this.storyId = id;
        this.storyService.getStory(id.toString());
        this.startTypingPoll(id);
      }
    });
  }

}

