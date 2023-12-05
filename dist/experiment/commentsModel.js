"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsMainType = exports.CommentsViewModel = void 0;
class CommentsViewModel {
    constructor(id, content, commentatorInfo, createdAt, likesInfo) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
    }
}
exports.CommentsViewModel = CommentsViewModel;
class CommentsMainType {
    constructor(id, content, commentatorInfo, createdAt, postId, likesInfo) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.postId = postId;
        this.likesInfo = likesInfo;
    }
}
exports.CommentsMainType = CommentsMainType;
