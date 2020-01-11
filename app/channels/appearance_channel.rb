class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "appearance"
  end

  def unsubscribed
    stop_all_streams
  end
end
