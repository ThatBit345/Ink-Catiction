package com.momostudios.ink_catiction;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ScheduledFuture;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class InkWebSocketHandler extends TextWebSocketHandler
{
	private final Map<String, LobbyPlayer> lobbyPlayers = new ConcurrentHashMap<>();
	private final Map<String, Lobby> lobbies = new ConcurrentHashMap<>();
	
	private final Map<String, Player> gamePlayers = new ConcurrentHashMap<>();
	private final Map<String, Game> games = new ConcurrentHashMap<>();

	private final Queue<WebSocketSession> waitingPlayers = new ConcurrentLinkedQueue<>();

	private final ObjectMapper mapper = new ObjectMapper();

	/**
	 * Represents a player in-game, contains their WebSocket session, position 
	 * and selected character.
	 */
	private static class Player
	{
		WebSocketSession session;
		double x;
		double y;
		String character;
		int playerId;

		Player(WebSocketSession session)
		{
			this.session = session;
		}
	}

	private static class LobbyPlayer
	{
		WebSocketSession session;
		String character;
		boolean ready;

		LobbyPlayer(WebSocketSession session)
		{
			this.session = session;
		}
	}

	private enum PowerupType
	{
		DASH,
		POWER,
		BOMB
	}

	/**
	 * Represents a powerup in-game, contains its position and type.
	 */
	private static class Powerup
	{
		int x;
		int y;
		PowerupType type;

		Powerup()
		{
            Random rand = new Random();
            this.x = rand.nextInt(1700) + 100; // 100-1800 range
            this.y = rand.nextInt(500) + 180; // 180-680 range

			int type = rand.nextInt(PowerupType.values().length);
			this.type = PowerupType.values()[type]; // Random type
		}
	}
	
	/**
	 * Represents the active game state between two players.
	 * Includes the players, active powerups, map and timer.
	 */
	private static class Game
	{
		Player player1;
		Player player2;

		Powerup[] powerups;

		int[][] map; // Matrix where a '1' means 'player 1' has that cell and '2' means 'player 2' has that cell.

		int time = 88; // 88s
		ScheduledFuture<?> timerMask;

		Game(Player p1, Player p2)
		{
			this.player1 = p1;
			this.player2 = p2;

			powerups = new Powerup[3];
			map = new int[32][18];

			for (int x = 0; x < map.length; x++) 
			{
				for (int y = 0; y < map[x].length; y++) 
				{
					map[x][y] = 0;
				}
			}
		}
	}

	/**
	 * Represents an active lobby with two players.
	 * Includes the connected players.
	 */
	private static class Lobby
	{
		LobbyPlayer player1;
		LobbyPlayer player2;

		Lobby(LobbyPlayer p1, LobbyPlayer p2)
		{
			this.player1 = p1;
			this.player2 = p2;
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session)
	{
		waitingPlayers.add(session);
		lobbyPlayers.put(session.getId(), new LobbyPlayer(session));

		synchronized(this)
		{
			TryCreateLobby();
		}
	}

	/**
	 * Attempts to create a lobby with two players.
	 */
	private void TryCreateLobby()
	{
		if(waitingPlayers.size() >= 2)
		{
			WebSocketSession session1 = waitingPlayers.poll();
			WebSocketSession session2 = waitingPlayers.poll();

			LobbyPlayer player1 = new LobbyPlayer(session1);
			LobbyPlayer player2 = new LobbyPlayer(session2);

			Lobby lobby = new Lobby(player1, player2);
			lobbies.put(session1.getId(), lobby);
			lobbies.put(session2.getId(), lobby);

			SendToClient(session1, "I", session1.getId());
			SendToClient(session2, "I", session2.getId());
		}
	}

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message)
	{
		try
		{

			Lobby lobby = lobbies.get(session.getId());
			if(lobby == null)
			{
				Game game = games.get(session.getId());
				if(game == null) return;

				// GAME RELATED MESSAGES
			}
			else // Player is in a lobby
			{
				LobbyPlayer currPlayer = lobby.player1.session.getId() == session.getId() ? lobby.player1 : lobby.player2;
				LobbyPlayer otherPlayer = lobby.player1.session.getId() == session.getId() ? lobby.player2 : lobby.player1;

				String payload = message.getPayload();
				char type = payload.charAt(0);
				String data = payload.length() > 1 ? payload.substring(1) : "";

				switch(type)
				{
					case 'Y':
						String character = mapper.readValue(data, String.class);

						if(otherPlayer.character != null)
						{
							if(otherPlayer.character.matches(character))
							{
								SendToClient(session, "Y", Arrays.asList(currPlayer.session.getId(), "no"));
								break;
							}
						}

						currPlayer.character = character;
						SendToClient(otherPlayer.session, "Y", currPlayer.character);
						break;
				}
			}
		}
		catch (IOException e) 
		{
            e.printStackTrace();
        }
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
	{
		waitingPlayers.remove(session);

		if(lobbyPlayers.containsKey(session.getId())) // Player in lobby
		{
			lobbyPlayers.remove(session.getId());

			// Close the lobby if present
			Lobby lobby = lobbies.remove(session.getId());
			if(lobby != null) CloseLobby(lobby);
		}
		else // Player in game
		{
			gamePlayers.remove(session.getId());

			// End game if started
			Game game = games.remove(session.getId());
			if(game != null) EndGame(game);
		}
	}

	/**
	 * Close the lobby if any errors occur or any players leave.
	 * Message format 'L': Close lobby
	 * @param lobby Lobby to be closed
	 */
	private void CloseLobby(Lobby lobby)
	{
		if(this.lobbies.containsKey(lobby.player1.session.getId()))
		{
			SendToClient(lobby.player1.session, "L", null);
		}

		if(this.lobbies.containsKey(lobby.player2.session.getId()))
		{
			SendToClient(lobby.player2.session, "L", null);
		}

		lobbies.remove(lobby.player1.session.getId());
		lobbies.remove(lobby.player2.session.getId());
	}

	/**
	 * Close the lobby if any errors occur or any players leave.
	 * Message format 'F': End game with scores [player1score, player2score]
	 * @param lobby Lobby to be closed
	 */
	private void EndGame(Game game)
	{
		List<Integer> scores = new ArrayList();
		scores.add(10); // Player 1
		scores.add(10); // Player 2

		if(this.lobbies.containsKey(game.player1.session.getId()))
		{
			SendToClient(game.player1.session, "F", scores);
		}

		if(this.lobbies.containsKey(game.player2.session.getId()))
		{
			SendToClient(game.player2.session, "F", scores);
		}

		games.remove(game.player1.session.getId());
		games.remove(game.player2.session.getId());
	}

	/**
     * Sends a message to a specific client with the given type and data.
     * Messages are formatted as: type + JSON data
     * 
     * @param session The target session
     * @param type   Single character message type
     * @param data   Data to be JSON serialized (can be null)
     */
	private void SendToClient(WebSocketSession session, String type, Object data)
	{
		try {
            String message = type;
            if (data != null) {
                message += mapper.writeValueAsString(data);
            }
            synchronized (session) {
                session.sendMessage(new TextMessage(message));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
}
