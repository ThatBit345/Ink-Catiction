package com.momostudios.ink_catiction;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Date;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/chat")
public class ChatController 
{
	private final List<Message> messages = new ArrayList<>();
	private final AtomicInteger lastId = new AtomicInteger(0);

	private final int MAX_MESSAGE_HISTORY = 11;

    @Autowired
    private ApiStatusService apiStatusService;

	@GetMapping()
	public ChatResponse GetMessages(@RequestParam int since)
	{
		List<String> responseMessages = new ArrayList<String>();
		//int latestId = since;

		synchronized(messages)
		{
			for (Message message : this.messages) 
			{
				//if(message.id() > since)
				//{
					String response = String.format("[%s] %s: %s", 
						message.timestamp(), message.user(), message.message());

					responseMessages.add(response);
					//latestId = message.id();
				//}
			}
		}

		return new ChatResponse(responseMessages, 0);
	}

	@PostMapping()
	public void PostMessage(@RequestParam String user, @RequestParam String message)
	{
		synchronized(messages)
		{
			this.apiStatusService.hasSeen(user);

			// Get current time
			Date date = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("hh:mm");
			String timestamp = sdf.format(date);

			Message entry = new Message(timestamp, user, message, lastId.incrementAndGet());
			System.out.println("Received message " + lastId + " with contents: [" + user + "]:[" + message + "]");
			this.messages.add(entry);

			if(this.messages.size() > MAX_MESSAGE_HISTORY)
			{
				this.messages.remove(0);
			}
		}
	}

	public static class ChatResponse
	{
		private final List<String> messages;
		private final int timestamp;

		public ChatResponse(List<String> messages, int timestamp)
		{
			this.messages = messages;
			this.timestamp = timestamp;
		}

		public List<String> getMessages() {
            return messages;
        }

        public int getTimestamp() {
            return timestamp;
        }
	}
}
