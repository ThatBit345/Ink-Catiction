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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/chat")
public class ChatController 
{
	private final List<Message> messages = new ArrayList<>();
	private final AtomicInteger lastId = new AtomicInteger(0);

	private final int MAX_MESSAGE_HISTORY = 11;

    @Autowired
    private ApiStatusService apiStatusService;

	/**
     * GET /api/chat/{since}
     * 
     * @param since
     * @return
     */
	@GetMapping("/{since}")
	public ResponseEntity<ChatResponse> GetMessages(@PathVariable int since)
	{
		List<String> responseMessages = new ArrayList<String>();

		synchronized(messages)
		{
			for (Message message : this.messages) 
			{
				String response = String.format("[%s] %s: %s", 
					message.timestamp(), message.user(), message.message());

				responseMessages.add(response);
			}
		}

		return ResponseEntity.ok(new ChatResponse(responseMessages, 0));
	}

	/**
     * POST /api/chat/
     * 
     * @param user
     * @return
     */
	@PostMapping("/")
	public ResponseEntity<?> PostMessage(@RequestBody MessageRequest request)
	{
		synchronized(messages)
		{
			this.apiStatusService.hasSeen(request.user());

			// Get current time
			Date date = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("hh:mm");
			String timestamp = sdf.format(date);

			Message entry = new Message(timestamp, request.user(), request.message(), lastId.incrementAndGet());
			System.out.println("Received message " + lastId + " with contents: [" + request.user() + "]:[" + request.message() + "]");
			this.messages.add(entry);

			if(this.messages.size() > MAX_MESSAGE_HISTORY)
			{
				this.messages.remove(0);
			}

			return ResponseEntity.noContent().build();
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
