class DeletedMessages {
  constructor(userId, content) {
    this.userId = userId;
    this.content = content;
    this.time = new Date();
    this.timestamp = Date.now();
  }
}

module.exports = DeletedMessages;
