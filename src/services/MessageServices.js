class MessageService {
  async isAttachedImage(msgAttach) {
    var url = msgAttach.url;

    return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
  }
}

module.exports = new MessageService();