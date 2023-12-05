"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesListDb = exports.LikeInfoDb = exports.LikeInfoView = exports.likeStatuses = void 0;
var likeStatuses;
(function (likeStatuses) {
    likeStatuses["Like"] = "Like";
    likeStatuses["Dislike"] = "Dislike";
    likeStatuses["None"] = "None";
})(likeStatuses || (exports.likeStatuses = likeStatuses = {}));
class LikeInfoView {
    constructor(likesCount, dislikesCount, myStatus) {
        this.likesCount = likesCount;
        this.dislikesCount = dislikesCount;
        this.myStatus = myStatus;
    }
}
exports.LikeInfoView = LikeInfoView;
class LikeInfoDb {
    constructor(likeList, likesCount, dislikesCount) {
        this.likeList = likeList;
        this.likesCount = likesCount;
        this.dislikesCount = dislikesCount;
    }
}
exports.LikeInfoDb = LikeInfoDb;
class LikesListDb {
    constructor(userId, createdAt, rate) {
        this.userId = userId;
        this.createdAt = createdAt;
        this.rate = rate;
    }
}
exports.LikesListDb = LikesListDb;
