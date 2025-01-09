package com.momostudios.ink_catiction;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.*;
import java.util.concurrent.*;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class InkWebSocketHandler extends TextWebSocketHandler {
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
	private static class Player {
		WebSocketSession session;
		int num;
		double x;
		double y;
		String character;

		int powerupDuration;
		boolean hasPowerup;

		int life;
		int respawnTimer;
		boolean inRespawn;

		boolean initialized;

		Player(WebSocketSession session, int num, String character) {
			this.session = session;
			this.num = num;
			this.character = character;
			this.life = 4;
			this.respawnTimer = 0;
			this.inRespawn = false;
		}
	}

	private static class LobbyPlayer {
		WebSocketSession session;
		String character;
		boolean ready;

		LobbyPlayer(WebSocketSession session) {
			this.session = session;
		}
	}

	private enum PowerupType {
		DASH,
		POWER,
		BOMB
	}

	/**
	 * Represents a powerup in-game, contains its position and type.
	 */
	private static class Powerup {
		int x;
		int y;
		PowerupType type;

		Powerup() {
			Random rand = new Random();
			this.x = rand.nextInt(1080) + 100; // 100-1180 range
			// this.x = (int)Math.floor(Math.random()*(1800-100+1)+100); // 100-1800 range
			this.y = rand.nextInt(420) + 180; // 180-600 range
			// this.y = (int)Math.floor(Math.random()*(680-180+1)+180); // 180-680 range

			int type = rand.nextInt(PowerupType.values().length);
			this.type = PowerupType.values()[type]; // Random type
		}
	}

	/**
	 * Represents the active game state between two players.
	 * Includes the players, active powerups, map and timer.
	 */
	private static class Game {
		Player player1;
		Player player2;

		Powerup[] powerups;

		int[][] map; // Matrix where a '1' means 'player 1' has that cell and '2' means 'player 2'
						// has that cell.

		int time = 88; // 88s
		ScheduledFuture<?> timerTask;

		Game(Player p1, Player p2) {
			this.player1 = p1;
			this.player2 = p2;

			powerups = new Powerup[3];
			map = new int[32][18];

			for (int x = 0; x < map.length; x++) {
				for (int y = 0; y < map[x].length; y++) {
					map[x][y] = 0;
				}
			}
		}
	}

	/**
	 * Represents an active lobby with two players.
	 * Includes the connected players.
	 */
	private static class Lobby {
		LobbyPlayer player1;
		LobbyPlayer player2;

		Lobby(LobbyPlayer p1, LobbyPlayer p2) {
			this.player1 = p1;
			this.player2 = p2;
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) {
		waitingPlayers.add(session);
		lobbyPlayers.put(session.getId(), new LobbyPlayer(session));

		synchronized (this) {
			TryCreateLobby();
		}
	}

	/**
	 * Attempts to create a lobby with two players.
	 */
	private void TryCreateLobby() {
		if (waitingPlayers.size() >= 2) {
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
	 * 
	 * @param lobby Lobby from which to transfer the players over.
	 */
	private void CreateGame(Lobby lobby) {
		Player player1 = new Player(lobby.player1.session, 1, lobby.player1.character);
		Player player2 = new Player(lobby.player2.session, 2, lobby.player2.character);

		Game game = new Game(player1, player2);

		game.player1.x = 128;
		game.player1.y = 215;

		game.player2.x = 1152;
		game.player2.y = 215;

		game.powerups[0] = new Powerup();
		game.powerups[1] = new Powerup();
		game.powerups[2] = new Powerup();

		List<List<Object>> powerups = Arrays.asList(
				Arrays.asList(game.powerups[0].x, game.powerups[0].y, game.powerups[0].type), // Powerup 0
				Arrays.asList(game.powerups[1].x, game.powerups[1].y, game.powerups[1].type), // Powerup 1
				Arrays.asList(game.powerups[2].x, game.powerups[2].y, game.powerups[2].type) // Powerup 2
		);

		double[] pos1 = { game.player1.x, game.player1.y };
		double[] pos2 = { game.player2.x, game.player2.y };

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

	private void TryGameInit(Game game) {
		if (!game.player1.initialized || !game.player2.initialized)
			return;

		game.timerTask = scheduler.scheduleAtFixedRate(() -> {
			GameTick(game);
		}, 0, 1, TimeUnit.SECONDS);
	}

	/**
	 * Main game loop that ticks every second.
	 * Updates timer and spawns new powerups every 10 seconds.
	 * Message format 'T': Time update
	 */
	private void GameTick(Game game) {
		game.time--;

		SendToClient(game.player1.session, "T", game.time);
		SendToClient(game.player2.session, "T", game.time);

		// Check respawn timers
		if (game.player1.inRespawn) {
			game.player1.respawnTimer--;

			if (game.player1.respawnTimer <= 0) {
				game.player1.life = 4;
				game.player1.inRespawn = false;
				SendToClient(game.player1.session, "R", 1);
				SendToClient(game.player2.session, "R", 1);
			}
		}

		if (game.player2.inRespawn) {
			game.player2.respawnTimer--;

			if (game.player2.respawnTimer <= 0) {
				game.player2.life = 4;
				game.player2.inRespawn = false;
				SendToClient(game.player1.session, "R", 2);
				SendToClient(game.player2.session, "R", 2);
			}
		}

		if (game.player1.hasPowerup) {
			game.player1.powerupDuration--;

			if (game.player1.powerupDuration <= 0) {
				game.player1.hasPowerup = false;
				SendToClient(game.player1.session, "O", 1);
				SendToClient(game.player2.session, "O", 1);
			}
		}

		if (game.player2.hasPowerup) {
			game.player2.powerupDuration--;

			if (game.player2.powerupDuration <= 0) {
				game.player2.hasPowerup = false;
				SendToClient(game.player1.session, "O", 2);
				SendToClient(game.player2.session, "O", 2);
			}
		}

		if (game.time % 5 == 0) {
			RespawnPowerups(game);
		}

		if (game.time <= 0) {
			EndGame(game);
		}
	}

	/**
	 * Respawns missing powerups
	 * Message format 'S': Powerup spawn [x, y, type]
	 */
	private void RespawnPowerups(Game game) {
		if (game.powerups[0] == null) {
			game.powerups[0] = new Powerup();
			SendToClient(game.player1.session, "S",
					Arrays.asList(game.powerups[0].x, game.powerups[0].y, game.powerups[0].type));
			SendToClient(game.player2.session, "S",
					Arrays.asList(game.powerups[0].x, game.powerups[0].y, game.powerups[0].type));
		}
		if (game.powerups[1] == null) {
			game.powerups[1] = new Powerup();
			SendToClient(game.player1.session, "S",
					Arrays.asList(game.powerups[1].x, game.powerups[1].y, game.powerups[1].type));
			SendToClient(game.player2.session, "S",
					Arrays.asList(game.powerups[1].x, game.powerups[1].y, game.powerups[1].type));
		}
		if (game.powerups[2] == null) {
			game.powerups[2] = new Powerup();
			SendToClient(game.player1.session, "S",
					Arrays.asList(game.powerups[2].x, game.powerups[2].y, game.powerups[2].type));
			SendToClient(game.player2.session, "S",
					Arrays.asList(game.powerups[2].x, game.powerups[2].y, game.powerups[2].type));
		}
	}

	private void PowerupCollection(Game game) {
		if (ManhattanDistance(game.player1, game.powerups[0]) < 80) {
			SendToClient(game.player1.session, "C", Arrays.asList(game.powerups[0].x, game.powerups[0].y, game.player1.num));
			SendToClient(game.player2.session, "C", Arrays.asList(game.powerups[0].x, game.powerups[0].y, game.player1.num));
		}

		if (ManhattanDistance(game.player1, game.powerups[1]) < 80) {
			SendToClient(game.player1.session, "C", Arrays.asList(game.powerups[1].x, game.powerups[1].y, game.player1.num));
			SendToClient(game.player2.session, "C", Arrays.asList(game.powerups[1].x, game.powerups[1].y, game.player1.num));
		}
		
		if (ManhattanDistance(game.player1, game.powerups[2]) < 80) {
			SendToClient(game.player1.session, "C", Arrays.asList(game.powerups[2].x, game.powerups[2].y, game.player1.num));
			SendToClient(game.player2.session, "C", Arrays.asList(game.powerups[2].x, game.powerups[2].y, game.player1.num));
		}

		if (ManhattanDistance(game.player2, game.powerups[0]) < 80) {
			SendToClient(game.player1.session, "C", Arrays.asList(game.powerups[0].x, game.powerups[0].y, game.player2.num));
			SendToClient(game.player2.session, "C", Arrays.asList(game.powerups[0].x, game.powerups[0].y, game.player2.num));
		}

		if (ManhattanDistance(game.player2, game.powerups[1]) < 80) {
			SendToClient(game.player1.session, "C", Arrays.asList(game.powerups[1].x, game.powerups[1].y, game.player2.num));
			SendToClient(game.player2.session, "C", Arrays.asList(game.powerups[1].x, game.powerups[1].y, game.player2.num));
		}
		
		if (ManhattanDistance(game.player2, game.powerups[2]) < 80) {
			SendToClient(game.player1.session, "C", Arrays.asList(game.powerups[2].x, game.powerups[2].y, game.player2.num));
			SendToClient(game.player2.session, "C", Arrays.asList(game.powerups[2].x, game.powerups[2].y, game.player2.num));
		}
	}

	private void UpdateGrid(Game game, double x, double y, int playerNum) {
		int[][] grid = game.map;

		// Align positions to the grid starting at (80,180) with cells of dimensions
		// 40x40 units.
		int gridX = (int) Math.floor((x - 80) / 40);
		int gridY = (int) Math.floor((y - 180) / 40);

		if (gridX < 0 || gridY < 0 || gridX > 28 || gridY > 14)
			return; // OoB
		grid[gridX][gridY] = playerNum;
	}

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) {
		try {
			String payload = message.getPayload();
			char type = payload.charAt(0);
			String data = payload.length() > 1 ? payload.substring(1) : "";

			Lobby lobby = lobbies.get(session.getId());
			if (lobby == null) {
				Game game = games.get(session.getId());
				if (game == null)
					return;

				Player currPlayer = game.player1.session.getId() == session.getId() ? game.player1 : game.player2;
				Player otherPlayer = game.player1.session.getId() == session.getId() ? game.player2 : game.player1;

				// GAME RELATED MESSAGES
				switch (type) {
					case 'G':
						currPlayer.initialized = true;
						TryGameInit(game);
						break;

					case 'P':
						double[] pos = mapper.readValue(data, double[].class);
						currPlayer.x = pos[0];
						currPlayer.y = pos[1];

						UpdateGrid(game, currPlayer.x, currPlayer.y, currPlayer.num);

						SendToClient(otherPlayer.session, "P", Arrays.asList(currPlayer.x, currPlayer.y));
						break;

					case 'A':
						SendToClient(otherPlayer.session, "A", null);
						float distance = ChevyshevDistance(currPlayer, otherPlayer);

						if (distance < 80) {
							otherPlayer.life--;
							if (otherPlayer.life <= 0) {
								SendToClient(currPlayer.session, "D", otherPlayer.num);
								SendToClient(otherPlayer.session, "D", otherPlayer.num);
								otherPlayer.respawnTimer = 12; // 12 seconds
								otherPlayer.inRespawn = true;
							}
						}
						break;
					case 'C':
						//PowerupCollection(game);

						for (int i = 0; i < game.powerups.length; i++) 
						{
							if(game.powerups[i] != null)
							{
								if(ManhattanDistance(currPlayer, game.powerups[i]) < 40)
								{
									SendToClient(game.player1.session, "C", Arrays.asList(game.powerups[i].x, game.powerups[i].y, currPlayer.num));
									SendToClient(game.player2.session, "C", Arrays.asList(game.powerups[i].x, game.powerups[i].y, currPlayer.num));

									currPlayer.hasPowerup = true;
									currPlayer.powerupDuration = 5; // 5 seconds

									// Bomb special case
									if(game.powerups[i].type == PowerupType.BOMB)
									{
										int pX = game.powerups[i].x;
										int pY = game.powerups[i].y;

										for (int x = -1; x < 2; x++) 
										{
											for (int y = -1; y < 2; y++) 
											{
												if(pX + x < game.map.length)
												{
													if(pY + y < game.map[pX].length) game.map[pX + x][pY + y] = currPlayer.num;
												}
											}
										}
									}

									game.powerups[i] = null;
								}
							}
						}
						break;
				}

			} else // Player is in a lobby
			{
				LobbyPlayer currPlayer = lobby.player1.session.getId() == session.getId() ? lobby.player1
						: lobby.player2;
				LobbyPlayer otherPlayer = lobby.player1.session.getId() == session.getId() ? lobby.player2
						: lobby.player1;

				switch (type) {
					case 'Y':
						String character = mapper.readValue(data, String.class);

						if (otherPlayer.character != null) {
							if (otherPlayer.character.matches(character)) {
								SendToClient(session, "Y", "no");
								break;
							}
						}

						currPlayer.character = character;
						currPlayer.ready = true;
						SendToClient(otherPlayer.session, "Y", currPlayer.character);

						if (currPlayer.ready && otherPlayer.ready)
							CreateGame(lobby);
						break;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
		waitingPlayers.remove(session);

		if (lobbyPlayers.containsKey(session.getId())) // Player in lobby
		{
			lobbyPlayers.remove(session.getId());

			// Close the lobby if present
			Lobby lobby = lobbies.remove(session.getId());
			if (lobby != null)
				CloseLobby(lobby);
		} else // Player in game
		{
			gamePlayers.remove(session.getId());

			// End game if started
			Game game = games.remove(session.getId());
			if (game != null)
				EndGame(game);
		}
	}

	/**
	 * Close the lobby if any errors occur or any players leave.
	 * Message format 'L': Close lobby
	 * 
	 * @param lobby Lobby to be closed
	 */
	private void CloseLobby(Lobby lobby) {
		if (this.lobbies.containsKey(lobby.player1.session.getId())) {
			SendToClient(lobby.player1.session, "L", null);
		}

		if (this.lobbies.containsKey(lobby.player2.session.getId())) {
			SendToClient(lobby.player2.session, "L", null);
		}

		lobbies.remove(lobby.player1.session.getId());
		lobbies.remove(lobby.player2.session.getId());
	}

	/**
	 * Close the lobby if any errors occur or any players leave.
	 * Message format 'F': End game with scores [player1score, player2score]
	 * 
	 * @param game Game to be closed
	 */
	private void EndGame(Game game) {
		int[][] grid = game.map;
		int p1score = 0;
		int p2score = 0;

		for (int x = 0; x < grid.length; x++) {
			for (int y = 0; y < grid[x].length; y++) {
				if (grid[x][y] == 1)
					p1score++;
				else if (grid[x][y] == 2)
					p2score++;
			}
		}

		List<Integer> scores = new ArrayList();
		scores.add(p1score); // Player 1
		scores.add(p2score); // Player 2

		if (this.games.containsKey(game.player1.session.getId())) {
			SendToClient(game.player1.session, "F",
					Arrays.asList(scores, game.player1.character, game.player2.character));
		}

		if (this.games.containsKey(game.player2.session.getId())) {
			SendToClient(game.player2.session, "F",
					Arrays.asList(scores, game.player1.character, game.player2.character));
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
	 * @param type    Single character message type
	 * @param data    Data to be JSON serialized (can be null)
	 */
	private void SendToClient(WebSocketSession session, String type, Object data) {
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

	private float ChevyshevDistance(Player p1, Player p2) {
		return (float) Math.max(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
	}

	private float ManhattanDistance(Player p1, Powerup pu) {
		return (float) Math.abs(p1.x - pu.x) + (float) Math.abs(p1.y - pu.y);
	}
}
