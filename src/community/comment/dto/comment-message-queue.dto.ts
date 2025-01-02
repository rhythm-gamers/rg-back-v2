export class CommentMessageQueueDto {
  article?: CommentMessageQueueDetail;
  comment?: CommentMessageQueueDetail;
}

class CommentMessageQueueDetail {
  id: number;
  targetUUID: string;
  title: string;
  comment: string;
}
