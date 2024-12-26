package com.momostudios.ink_catiction;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;

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
	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

	/**
	 * Represents a player in-game, contains their WebSocket session, position 
	 * and selected character.
	 */
	private static class Player
	{
		WebSocketSession session;
		double x;
		double y;
		PowerupType powerup;
		int powerupDuration;
		boolean initialized;

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
		ScheduledFuture<?> timerTask;

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

	/**
	 * Creates a game with two players.
	 * @param lobby Lobby from which to transfer the players over.
	 */
	private void CreateGame(Lobby lobby)
	{
		Player player1 = new Player(lobby.player1.session);
		Player player2 = new Player(lobby.player2.session);

		Game game = new Game(player1, player2);

		game.powerups[0] = new Powerup();
		game.powerups[1] = new Powerup();
		game.powerups[2] = new Powerup();

		game.player1.x = 128;
		game.player1.y = 215;

		game.player2.x = 1152;
		game.player2.y = 215;

		List<List<Object>> powerups = Arrays.asList(
                Arrays.asList(game.powerups[0].x, game.powerups[0].y, game.powerups[0].type), // Powerup 0
                Arrays.asList(game.powerups[1].x, game.powerups[1].y, game.powerups[1].type), // Powerup 1
                Arrays.asList(game.powerups[2].x, game.powerups[2].y, game.powerups[2].type) // Powerup 2
        );

		double[] pos1 = {game.player1.x, game.player1.y};
		double[] pos2 = {game.player2.x, game.player2.y};

		// Transfer from lobby to game
		games.put(player1.session.getId(), game);
		games.put(player2.session.getId(), game);

		gamePlayers.put(player1.session.getId(), player1);
		gamePlayers.put(player2.session.getId(), player2);

		lobbies.remove(player1.session.getId());
		lobbies.remove(player2.session.getId());

		lobbyPlayers.remove(player1.session.getId());
		lobbyPlayers.remove(player2.session.getId());

		SendToClient(player1.session, "G", Map.of("id", 1, 
													   "character", lobby.player1.character,
													   "pos", pos1,
													   "other_character", lobby.player2.character,
													   "other_pos", pos2,
													   "powerups", powerups));
													   
		SendToClient(player2.session, "G", Map.of("id", 2, 
													   "character", lobby.player2.character,
													   "pos", pos2,
													   "other_character", lobby.player1.character,
													   "other_pos", pos1,
													   "powerups", powerups));
	
	}

	private void TryGameInit(Game game)
	{
		if(!game.player1.initialized || !game.player2.initialized) return;

		game.timerTask = scheduler.scheduleAtFixedRate( () -> {
			GameTick(game);
		}, 0, 1, TimeUnit.SECONDS);
	}

	/**
     * Main game loop that ticks every second.
     * Updates timer and spawns new powerups every 10 seconds.
     * Message format 'T': Time update
     */
	private void GameTick(Game game)
	{
		game.time--;

		SendToClient(game.player1.session, "T", game.time);
		SendToClient(game.player2.session, "T", game.time);

		if(game.time % 5 == 0)
		{
			RespawnPowerups(game);
		}

		if(game.time <= 0)
		{
			EndGame(game);
		}
	}

	/** 
	 * Respawns missing powerups
	 * Message format 'S': Powerup spawn [x, y, type]
	*/
	private void RespawnPowerups(Game game)
	{

	}

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message)
	{
		try
		{
			String payload = message.getPayload();
			char type = payload.charAt(0);
			String data = payload.length() > 1 ? payload.substring(1) : "";

			Lobby lobby = lobbies.get(session.getId());
			if(lobby == null)
			{
				Game game = games.get(session.getId());
				if(game == null) return;

				Player currPlayer = game.player1.session.getId() == session.getId() ? game.player1 : game.player2;
				Player otherPlayer = game.player1.session.getId() == session.getId() ? game.player2 : game.player1;

				// GAME RELATED MESSAGES
				switch (type) 
				{
					case 'G':
						currPlayer.initialized = true;
						TryGameInit(game);
						break;
					
					case 'P':
						double[] pos = mapper.readValue(data, double[].class);
						currPlayer.x = pos[0];
						currPlayer.y = pos[1];

						SendToClient(otherPlayer.session, "P", Arrays.asList(currPlayer.x, currPlayer.y));
				}

			}
			else // Player is in a lobby
			{
				LobbyPlayer currPlayer = lobby.player1.session.getId() == session.getId() ? lobby.player1 : lobby.player2;
				LobbyPlayer otherPlayer = lobby.player1.session.getId() == session.getId() ? lobby.player2 : lobby.player1;

				switch(type)
				{
					case 'Y':
						String character = mapper.readValue(data, String.class);

						if(otherPlayer.character != null)
						{
							if(otherPlayer.character.matches(character))
							{
								SendToClient(session, "Y", "no");
								break;
							}
						}

						currPlayer.character = character;
						currPlayer.ready = true;
						SendToClient(otherPlayer.session, "Y", currPlayer.character);

						if(currPlayer.ready && otherPlayer.ready) CreateGame(lobby);
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
	 * @param game Game to be closed
	 */
	private void EndGame(Game game)
	{
		List<Integer> scores = new ArrayList();
		scores.add(10); // Player 1
		scores.add(10); // Player 2

		if(this.games.containsKey(game.player1.session.getId()))
		{
			SendToClient(game.player1.session, "F", scores);
		}

		if(this.games.containsKey(game.player2.session.getId()))
		{
			SendToClient(game.player2.session, "F", scores);
		}

		// Cancel timer and cleanup game resources
        if (game.timerTask != null) {
            game.timerTask.cancel(false);
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
