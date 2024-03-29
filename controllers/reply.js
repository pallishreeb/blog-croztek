const Reply = require("../models/replyModel");
const { ObjectId } = require("mongodb");

module.exports = {
  //get reply on  a comment
  getrepliesOnComment: async (req, res) => {
    try {
      const { commentId } = req.query;
      const replies = await Reply.find({ commentId });
      return res
        .status(200)
        .json({
          success: true,
          message: `${replies.length} replies on given comment`,
          response: replies,
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal Server Error",
          error: error.message,
        });
    }
  },

  //do reply on a comment
  repliesOnComment: async (req, res) => {
    try {
      const { _id } = req.user;
      const { commentId, reply } = req.body;
    

      const newReply = await new Reply({
        reply,
        commentId,

        createdBy: _id,
      });
      await newReply.save();
      return res
        .status(200)
        .json({
          success: false,
          message: "Commented successfully",
          response: newReply,
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal Server Error",
          error: error.message,
        });
    }
  },
  //delete a reply
  deleteReply: async (req, res) => {
    try {
      const { _id } = req.user;
      const { replyId } = req.query;

      const reply = await Reply.findByIdAndDelete({_id : ObjectId(replyId)});
      if (!reply) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid id", response: {} });
      }

      
      return res
        .status(200)
        .json({
          success: true,
          message: "Comment deleted successfully",
          response: reply,
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal Server Error",
          error: error.message,
        });
    }
  },

  updateReply: async (req, res) => {
    try {
      const { replyId, replyText } = req.body;

      const reply = await Reply.findById({ _id: ObjectId(replyId)});
      if (!reply) {
        return res.status(404).json({
          success: false,
          message: "Invalid id, Replied comment not found",
          response: {},
        });
      }
     if(reply.createdBy.toString() != req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this comment",
        response: {},
      });
     }

      if (replyText) {
        reply.reply = replyText;
      }
      await reply.save();
      return res.status(200).json({
        success: true,
        message: "Replied Comment updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};